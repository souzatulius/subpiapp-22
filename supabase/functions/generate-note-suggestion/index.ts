
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the only allowed model
const ALLOWED_MODEL = 'gpt-4o-mini';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key not configured. Please set the OPENAI_API_KEY secret in the Supabase dashboard." 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request data
    let reqData;
    try {
      reqData = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { demandInfo, responses } = reqData;
    
    console.log("Received request data:", JSON.stringify({ 
      demandInfoKeys: demandInfo ? Object.keys(demandInfo) : null,
      responsesLength: responses ? responses.length : 0 
    }));
    
    // Validate input data
    if (!demandInfo) {
      console.error('Missing demand information in request');
      return new Response(
        JSON.stringify({ error: "Dados da demanda não fornecidos" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Format the demand information and responses for the prompt
    let promptContent = `Você é assessor de imprensa da Subprefeitura de Pinheiros. Sua tarefa é gerar uma nota de imprensa baseada nos dados da solicitação desta página. Observe as informações, perguntas cadastradas e respostas fornecidas por nossas áreas técnicas. Inicie sempre com A Subprefeitura de Pinheiros informa/esclarece/reforça/alerta ou outro verbo. Gere um texto formal, com tom informativo e objetivo.\n\n`;
    
    // Add demand information
    promptContent += `Título da Demanda: ${demandInfo.titulo || 'Não fornecido'}\n`;
    if (demandInfo.areas_coordenacao?.descricao) {
      promptContent += `Área: ${demandInfo.areas_coordenacao.descricao}\n`;
    }
    if (demandInfo.detalhes_solicitacao) {
      promptContent += `Detalhes da Solicitação: ${demandInfo.detalhes_solicitacao}\n\n`;
    }
    
    // Add Q&A if available
    if (responses && responses.length > 0) {
      promptContent += "Perguntas e Respostas:\n";
      responses.forEach((qa) => {
        promptContent += `Pergunta: ${qa.pergunta || 'Não fornecida'}\n`;
        promptContent += `Resposta: ${qa.resposta || 'Não fornecida'}\n\n`;
      });
    }
    
    promptContent += `Lembre-se: inicie sempre com "A Subprefeitura de Pinheiros" seguido por um verbo como informa, esclarece, reforça, alerta, etc. O tom deve ser formal, informativo e objetivo. Formate o resultado com um título sugestivo na primeira linha, seguido pelo conteúdo bem estruturado.`;

    console.log("Sending prompt to OpenAI:", promptContent.substring(0, 200) + "...");
    
    // Call OpenAI API with improved error handling
    try {
      console.log(`Calling OpenAI API with model: ${ALLOWED_MODEL}...`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ALLOWED_MODEL, // Enforcing the use of gpt-4o-mini only
          messages: [
            { role: 'system', content: 'Você é um assessor de imprensa especializado em comunicações oficiais para a Subprefeitura de Pinheiros.' },
            { role: 'user', content: promptContent }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const responseStatus = response.status;
      console.log("OpenAI API response status:", responseStatus);

      if (!response.ok) {
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error("OpenAI API error details:", errorData);
        } catch (error) {
          errorText = await response.text();
          console.error("OpenAI API error text:", errorText);
        }
        
        // Return appropriate error based on status code
        let errorMessage = "Erro na API do OpenAI";
        if (responseStatus === 401) {
          errorMessage = "Erro de autenticação na API do OpenAI. Verifique a chave API.";
        } else if (responseStatus === 429) {
          errorMessage = "Limite de requisições excedido na API do OpenAI.";
        } else if (responseStatus >= 500) {
          errorMessage = "Erro no servidor da OpenAI. Tente novamente mais tarde.";
        } else if (responseStatus === 400) {
          errorMessage = "Requisição inválida para a API da OpenAI. Verifique os parâmetros.";
        }
        
        return new Response(
          JSON.stringify({ error: `${errorMessage}: ${responseStatus} - ${errorText}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Handle successful response
      const data = await response.json();
      console.log("OpenAI API response received successfully");
      
      // Validate OpenAI response
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected OpenAI API response format:", JSON.stringify(data));
        return new Response(
          JSON.stringify({ error: "Formato de resposta inesperado da OpenAI" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const suggestion = data.choices[0].message.content;
      console.log("Suggestion from OpenAI:", suggestion.substring(0, 100) + "...");

      return new Response(
        JSON.stringify({ suggestion }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openAiError) {
      console.error('Error calling OpenAI API:', openAiError);
      return new Response(
        JSON.stringify({ error: openAiError.message || "Erro ao comunicar com OpenAI" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-note-suggestion function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Ocorreu um erro ao gerar a sugestão" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
