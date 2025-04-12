
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper for generating response
const responseHandler = (status: number, data: any) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

// Pre-process data to extract important insights before sending to AI
function preprocessData(sgzData: any[], painelData: any[]) {
  console.log(`Starting preprocessing - SGZ: ${sgzData?.length || 0} records, Painel: ${painelData?.length || 0} records`);

  // Check if we have valid data
  if (!sgzData?.length && !painelData?.length) {
    console.log("No data available for preprocessing");
    return {
      success: false,
      error: "No data provided for analysis"
    };
  }

  try {
    // Create summaries and extract key metrics to reduce token usage
    const sgzSummary = {
      totalCount: sgzData?.length || 0,
      statusCounts: countByField(sgzData || [], 'sgz_status'),
      districtCounts: countByField(sgzData || [], 'sgz_distrito'),
      serviceTypes: countByField(sgzData || [], 'sgz_tipo_servico', 10),
      departments: countByField(sgzData || [], 'sgz_departamento_tecnico', 5),
      averageDaysOpen: calculateAverageDays(sgzData || [])
    };

    const painelSummary = {
      totalCount: painelData?.length || 0,
      statusCounts: countByField(painelData || [], 'status'),
      districtCounts: countByField(painelData || [], 'distrito'),
      serviceTypes: countByField(painelData || [], 'tipo_servico', 10),
      departments: countByField(painelData || [], 'departamento', 5)
    };

    // Compare data between SGZ and Painel
    const comparison = compareDatabases(sgzData || [], painelData || []);

    return {
      success: true,
      sgzSummary,
      painelSummary,
      comparison,
      // Include small sample of raw data for context
      sgzSample: (sgzData || []).slice(0, 5),
      painelSample: (painelData || []).slice(0, 5)
    };
  } catch (error) {
    console.error("Error during data preprocessing:", error);
    return {
      success: false,
      error: `Error during preprocessing: ${error.message}`
    };
  }
}

// Count occurrences by field
function countByField(data: any[], fieldName: string, limit: number = 0) {
  const counts: Record<string, number> = {};
  
  data.forEach(item => {
    const value = item[fieldName] || 'Não informado';
    counts[value] = (counts[value] || 0) + 1;
  });
  
  // Convert to array, sort by count (desc)
  let result = Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
  
  // Limit if requested
  if (limit > 0 && result.length > limit) {
    result = result.slice(0, limit);
  }
  
  return result;
}

// Calculate average days for SGZ data
function calculateAverageDays(data: any[]) {
  if (!data.length) return 0;
  
  const totalDays = data.reduce((sum, item) => {
    return sum + (parseInt(item.sgz_dias_ate_status_atual) || 0);
  }, 0);
  
  return totalDays / data.length;
}

// Compare SGZ and Painel data
function compareDatabases(sgzData: any[], painelData: any[]) {
  // Map OS by ID for quick lookup
  const sgzMap = new Map();
  sgzData.forEach(item => {
    sgzMap.set(item.ordem_servico, item);
  });
  
  const painelMap = new Map();
  painelData.forEach(item => {
    painelMap.set(item.id_os, item);
  });
  
  const missingInPainel = sgzData
    .filter(item => !painelMap.has(item.ordem_servico))
    .length;
  
  const missingInSGZ = painelData
    .filter(item => !sgzMap.has(item.id_os))
    .length;
  
  // Find status discrepancies 
  const statusDifferences = [];
  sgzData.forEach(sgzItem => {
    const painelItem = painelMap.get(sgzItem.ordem_servico);
    if (painelItem && sgzItem.sgz_status !== painelItem.status) {
      statusDifferences.push({
        id_os: sgzItem.ordem_servico,
        sgz_status: sgzItem.sgz_status,
        painel_status: painelItem.status
      });
    }
  });
  
  return {
    missingInPainel,
    missingInSGZ,
    statusDifferencesCount: statusDifferences.length,
    statusDifferenceSamples: statusDifferences.slice(0, 5)
  };
}

// Generate OpenAI prompt
function generatePrompt(processedData: any) {
  return {
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a data analyst specializing in urban services management and government operations.
          You'll analyze data from two systems tracking service orders in São Paulo:
          1. SGZ (Sistema de Gerenciamento de Zeladoria) - The main system
          2. Painel da Zeladoria - The newer dashboard system
          
          Provide clear, insightful analysis that helps administrators understand how well services are being delivered.
          Focus on actionable insights rather than just describing the data.
          Always respond in Portuguese (Brazil).
          
          Format your response as a JSON with the following structure:
          {
            "indicadores": {
              "desempenho": {
                "valor": "valor numérico ou texto curto",
                "comentario": "explicação e análise"
              },
              "consistencia": {
                "valor": "valor numérico ou texto curto",
                "comentario": "explicação e análise"
              },
              "distritos": {
                "valor": "valor numérico ou texto curto",
                "comentario": "explicação e análise"
              },
              "servicos": {
                "valor": "valor numérico ou texto curto",
                "comentario": "explicação e análise"
              },
              "divergencias": {
                "valor": "valor numérico ou texto curto",
                "comentario": "explicação e análise"
              }
            }
          }`
      },
      {
        role: "user",
        content: `Analise estes dados do sistema SGZ e do Painel de Zeladoria e forneça insights sobre:
          
          1. Desempenho e eficiência (tempo médio de resolução, status mais comuns)
          2. Consistência dos dados entre sistemas (diferenças importantes)
          3. Distribuição por distritos (áreas com mais demandas)
          4. Tipos de serviços mais solicitados e suas características
          5. Divergências específicas entre SGZ e Painel
          
          Dados para análise:
          ${JSON.stringify(processedData, null, 2)}
          
          Lembre-se de apresentar sua resposta no formato JSON conforme especificado.`
      }
    ]
  };
}

async function callOpenAI(prompt: any) {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key not configured");
    return {
      error: "OpenAI API key not configured"
    };
  }
  
  try {
    console.log("Calling OpenAI API...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(prompt)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return {
        error: `OpenAI API error: ${errorData}`
      };
    }
    
    const data = await response.json();
    console.log("OpenAI response received successfully");
    
    try {
      // Parse the JSON response from the content
      const content = data.choices[0].message.content;
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", parseError);
      return {
        error: "Failed to parse AI response as JSON",
        rawContent: data.choices[0].message.content
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return {
      error: `Failed to call OpenAI: ${error.message}`
    };
  }
}

// Store insights in the database
async function storeInsights(uploadId: string, insights: any) {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
  
  if (!insights || !uploadId) {
    console.log("Missing data for storing insights");
    return false;
  }
  
  try {
    // Check if insights already exist for this upload
    const { data: existingInsights } = await supabaseAdmin
      .from('painel_zeladoria_insights')
      .select('id')
      .eq('painel_id', uploadId)
      .single();
      
    if (existingInsights) {
      // Update existing insights
      const { error } = await supabaseAdmin
        .from('painel_zeladoria_insights')
        .update({ indicadores: insights })
        .eq('id', existingInsights.id);
        
      if (error) throw error;
      console.log("Updated existing insights");
      return true;
    } else {
      // Insert new insights
      const { error } = await supabaseAdmin
        .from('painel_zeladoria_insights')
        .insert({
          painel_id: uploadId,
          indicadores: insights
        });
        
      if (error) throw error;
      console.log("Inserted new insights");
      return true;
    }
  } catch (error) {
    console.error("Error storing insights in database:", error);
    return false;
  }
}

// Main function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request for generate-ranking-insights");
    const requestData = await req.json();
    const { sgz_data, painel_data, upload_id } = requestData;
    
    // Validate required data
    if (!sgz_data && !painel_data) {
      console.error("No data provided");
      return responseHandler(400, { error: "No data provided" });
    }
    
    // Log data summary
    console.log(`Received data - SGZ: ${sgz_data?.length || 0} records, Painel: ${painel_data?.length || 0} records`);
    
    // Preprocess data
    const processedData = preprocessData(sgz_data, painel_data);
    
    if (!processedData.success) {
      return responseHandler(400, { error: processedData.error });
    }
    
    // Generate prompt and call OpenAI
    const prompt = generatePrompt(processedData);
    const aiResponse = await callOpenAI(prompt);
    
    if (aiResponse.error) {
      return responseHandler(500, { error: aiResponse.error });
    }
    
    // Store insights if we have an upload_id
    if (upload_id) {
      await storeInsights(upload_id, aiResponse.indicadores || aiResponse);
    }
    
    return responseHandler(200, { 
      insights: aiResponse,
      processed: {
        sgzCount: processedData.sgzSummary.totalCount,
        painelCount: processedData.painelSummary.totalCount
      }
    });
    
  } catch (error) {
    console.error("Error in generate-ranking-insights function:", error);
    return responseHandler(500, { error: error.message });
  }
});
