
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

    const { demandInfo, responses } = await req.json();
    
    // Format the prompt with the more complete instructions
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
Data: ${demandInfo.currentDate}

> Use **tom técnico, institucional e direto**, com frases curtas. Evite termos vagos, generalizações ou repetições.

Retorne apenas um objeto JSON com os campos separados:
{
  "titulo": "...",
  "nota": "..."
}

INFORMAÇÕES SOBRE A DEMANDA:
`;
    
    // Add demand information
    promptContent += `Título/Resumo do problema: ${demandInfo.problemSummary}\n`;
    promptContent += `Tema/Área: ${demandInfo.theme}\n`;
    promptContent += `Local: ${demandInfo.location}\n`;
    promptContent += `Status: ${demandInfo.status}\n`;
    promptContent += `Prazo: ${demandInfo.deadline}\n`;
    
    // Add more details from the request if available
    if (demandInfo.detalhes_solicitacao) {
      promptContent += `Detalhes da Solicitação: ${demandInfo.detalhes_solicitacao}\n\n`;
    }
    
    // Add Q&A if available
    if (responses && responses.length > 0) {
      promptContent += "\nPERGUNTAS E RESPOSTAS:\n";
      responses.forEach((qa, index) => {
        promptContent += `Pergunta ${index + 1}: ${qa.question}\n`;
        promptContent += `Resposta ${index + 1}: ${qa.answer}\n\n`;
      });
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

    // Parse the response as JSON to extract titulo and nota
    let parsedResponse;
    try {
      // Extract JSON object from the response if it's wrapped in markdown or other text
      const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : assistantResponse;
      parsedResponse = JSON.parse(jsonString);
      
      if (!parsedResponse.titulo || !parsedResponse.nota) {
        throw new Error("Response doesn't contain required fields");
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Fallback: If can't parse JSON, create a structured response with default title
      parsedResponse = {
        titulo: demandInfo.problemSummary || "Nota da Subprefeitura de Pinheiros",
        nota: assistantResponse
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-note-suggestion function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Ocorreu um erro ao gerar a sugestão",
      titulo: "Erro na geração da nota",
      nota: "Não foi possível gerar a nota devido a um erro técnico. Por favor, tente novamente mais tarde."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
