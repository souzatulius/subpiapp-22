
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  generatePressRequestPrompt,
  generateNotaImprensaPrompt,
  generateReleaseToNewsPrompt,
  generateEsicJustificativaPrompt,
  generateZeladoriaChartsPrompt 
} from "./prompts.ts";

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
    const { tipo, dados } = await req.json();

    let prompt: string;
    let model: string = 'gpt-4o-mini'; // Default model
    let temperature: number = 0.5; // Default temperature
    let responseFormat: any = undefined; // Default response format

    switch (tipo) {
      case 'resumo_solicitacao':
        prompt = generatePressRequestPrompt(dados);
        break;
      case 'nota_imprensa':
        prompt = generateNotaImprensaPrompt(dados);
        break;
      case 'release':
        prompt = generateReleaseToNewsPrompt(dados);
        break;
      case 'esic':
        prompt = generateEsicJustificativaPrompt(dados);
        break;
      case 'graficos_zeladoria':
        prompt = generateZeladoriaChartsPrompt(dados);
        temperature = 0.3; // Lower temperature for more deterministic results
        responseFormat = { type: "json_object" }; // Ensure JSON response format
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Tipo inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
        ...(responseFormat ? { response_format: responseFormat } : {})
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const resultado = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ resultado }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-with-gpt function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno ao processar a solicitação' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
