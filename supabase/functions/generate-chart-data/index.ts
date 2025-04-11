
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
    // Check if the OpenAI API key is available
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured in Supabase');
      return new Response(
        JSON.stringify({ 
          error: "OPENAI_API_KEY não configurada no Supabase",
          chartData: null
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { chartType, data, filters } = await req.json();
    
    if (!chartType || !data) {
      throw new Error('Tipo de gráfico ou dados ausentes');
    }

    // Limit data to first 50 rows to avoid token limits
    const limitedData = data.slice(0, 50);

    // Build the prompt for the OpenAI API
    const prompt = generatePromptForChartType(chartType, limitedData, filters);

    // Call the OpenAI API
    console.log("Calling OpenAI API for chart data generation");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a data analyst specializing in municipal service data. Generate chart data in JSON format based on the provided raw data.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    const openAiResponse = await response.json();
    
    if (openAiResponse.error) {
      console.error("OpenAI API error:", openAiResponse.error);
      throw new Error(openAiResponse.error.message || "Erro na API do OpenAI");
    }
    
    // Extract the response content
    const content = openAiResponse.choices[0].message.content;
    console.log("Received response from OpenAI");
    
    // Parse the JSON from the response
    try {
      // Look for JSON object in the response
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No JSON object found in the response");
      }
      
      const parsedData = JSON.parse(match[0]);
      
      return new Response(
        JSON.stringify({ chartData: parsedData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (e) {
      console.error("Failed to parse JSON from OpenAI response:", e);
      throw new Error("Failed to process the generated chart data");
    }
  } catch (error) {
    console.error('Error in generate-chart-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao gerar dados para o gráfico",
        chartData: null
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Function to generate the appropriate prompt for each chart type
function generatePromptForChartType(chartType: string, data: any[], filters?: any): string {
  const basePrompt = `Analyze the following data from a municipal service system and generate appropriate data for a ${chartType} chart. The data represents service orders (OS) with their details.\n\n`;
  
  const dataString = JSON.stringify(data, null, 2).substring(0, 3000); // Limit data size for token efficiency
  
  const filtersString = filters ? `\nApply the following filters: ${JSON.stringify(filters, null, 2)}` : '';
  
  const responseFormat = `\nRespond ONLY with a valid JSON object containing the processed data ready to use in a chart, structured appropriately for the chart type.`;
  
  let specificPrompt = '';
  
  switch (chartType) {
    case 'statusDistribution':
      specificPrompt = 'Calculate the distribution of status values (e.g., "FECHADA", "PENDENTE", "CANCELADA") in the data. Return counts for each status category.';
      break;
    case 'serviceTypes':
      specificPrompt = 'Group the orders by service type and count the frequency of each type. Return the top 10 most common service types.';
      break;
    case 'districtPerformance':
      specificPrompt = 'For each district, calculate (1) the percentage of completed orders, (2) the average resolution time, and (3) the total number of orders. Return data for the top 10 districts by order volume.';
      break;
    case 'responsibility':
      specificPrompt = 'Group the orders by the responsible entity and count how many orders each entity is responsible for. Calculate the percentage of completed orders for each entity.';
      break;
    case 'resolutionTime':
      specificPrompt = 'Calculate the average resolution time (in days) for orders, grouped by month or week depending on the data range. Show the trend over time.';
      break;
    case 'oldestPending':
      specificPrompt = 'Find the oldest pending orders. For each, include the service type, district, opening date, and days pending. Return the top 10 oldest pending orders.';
      break;
    default:
      specificPrompt = `Generate appropriate data for a ${chartType} visualization based on patterns and insights in the data.`;
  }
  
  return `${basePrompt}${specificPrompt}${filtersString}\n\nData:\n${dataString}${responseFormat}`;
}
