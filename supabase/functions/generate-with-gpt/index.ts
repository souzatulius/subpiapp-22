
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const { tipo, dados } = await req.json();
    
    if (tipo === 'nota_imprensa') {
      return await generateNotaImprensa(dados);
    } else {
      throw new Error(`Tipo de geração não suportado: ${tipo}`);
    }
  } catch (error) {
    console.error('Error in generate-with-gpt function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Ocorreu um erro ao gerar o conteúdo",
      resultado: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateNotaImprensa(dados: any) {
  // Format the prompt for a press release note
  let promptContent = `Você é assessor de imprensa da Subprefeitura de Pinheiros.

Com base nas informações da demanda exibida nesta página (incluindo o contexto do pedido da imprensa, as perguntas feitas pela coordenação de comunicação e as respostas fornecidas pelas áreas técnicas da Subprefeitura), redija uma **nota oficial clara, objetiva e institucional**, seguindo rigorosamente os critérios abaixo:

1. Crie um **título curto, informativo e direto ao ponto**, que resuma o tema principal da nota (por exemplo: "Limpeza de galhos na Rua X", "Responsabilidade por poda de árvore", "Demolição de imóvel na região Y").
2. Inicie o texto com uma **frase institucional**, usando verbos como **"informa", "esclarece", "reforça" ou "confirma"**.
3. Desenvolva **de um a três parágrafos objetivos**, com:
   - Contexto da demanda recebida (ex: denúncia, dúvida, reclamação)
   - Ação realizada ou posicionamento da Subprefeitura
   - **Local exato**, **data da ocorrência**, **tipo de serviço envolvido**
   - Indicação do **órgão responsável**, quando não for a Subprefeitura
   - **Prazos**, **números**, ou **exemplos concretos**, se aplicáveis
4. Finalize com uma **mensagem institucional de reforço**, como orientações à população (ex: uso do canal 156) ou reafirmação do compromisso da gestão local.
5. Sempre conclua com a assinatura oficial:

Subprefeitura de Pinheiros  
Prefeitura de São Paulo  
Data: ${dados.dataAtual}

> Use **tom técnico, institucional e direto**, com frases curtas. Evite termos vagos, generalizações ou repetições.

INFORMAÇÕES SOBRE A DEMANDA:
`;
  
  // Add demand information
  promptContent += `Resumo/Título do problema: ${dados.resumo}\n\n`;
  
  // Add more details from the request if available
  if (dados.comentariosAdicionais) {
    promptContent += `Detalhes da Solicitação: ${dados.comentariosAdicionais}\n\n`;
  }
  
  // Add Q&A if available
  if (dados.perguntas && dados.perguntas.length > 0) {
    promptContent += "\nPERGUNTAS E RESPOSTAS:\n";
    for (let i = 0; i < dados.perguntas.length; i++) {
      promptContent += `Pergunta ${i + 1}: ${dados.perguntas[i]}\n`;
      promptContent += `Resposta ${i + 1}: ${dados.respostas[i] || 'Sem resposta'}\n\n`;
    }
  }
  
  console.log("Sending prompt to OpenAI");
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Você é um assessor de imprensa profissional que redige notas oficiais em nome da Subprefeitura de Pinheiros. Utilize linguagem institucional, clara e objetiva.' 
        },
        { role: 'user', content: promptContent }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error("OpenAI API error:", data.error);
    throw new Error(data.error.message || "Erro na API do OpenAI");
  }
  
  const assistantResponse = data.choices[0].message.content;
  console.log("Received response from OpenAI");

  return new Response(JSON.stringify({
    resultado: assistantResponse
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
