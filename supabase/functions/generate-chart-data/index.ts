
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateZeladoriaChartsPrompt } from "./prompts.ts";

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
    const { chartType, data, filters } = await req.json();
    
    // Convert data array to CSV string if needed
    let csvContent = '';
    if (Array.isArray(data) && data.length > 0) {
      // Get headers from first object
      const headers = Object.keys(data[0]).join(',');
      
      // Convert each row to CSV
      const rows = data.map(row => 
        Object.values(row)
          .map(value => typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value)
          .join(',')
      );
      
      csvContent = [headers, ...rows].join('\n');
    }
    
    // Prepare the prompt based on chartType
    let prompt = '';
    switch (chartType) {
      case 'zeladoria-stats':
        prompt = generateZeladoriaChartsPrompt({ csv: csvContent });
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Chart type not supported' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Log the process (useful for debugging without exposing sensitive data)
    console.log(`Processing chart data for type: ${chartType}`);
    console.log(`Data rows: ${Array.isArray(data) ? data.length : 'N/A'}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for more deterministic results
        response_format: { type: "json_object" }, // Ensure JSON response format
      }),
    });

    const responseData = await response.json();
    
    if (responseData.error) {
      throw new Error(responseData.error.message || 'Error from OpenAI API');
    }

    // Parse and validate the result
    const chartData = JSON.parse(responseData.choices[0].message.content);

    return new Response(
      JSON.stringify({ chartData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-chart-data function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Error processing chart data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
