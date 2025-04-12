
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request data
    const { p_usuario_email, p_nome_arquivo, p_dados } = await req.json()

    // Validate inputs
    if (!p_usuario_email || !p_nome_arquivo || !p_dados || !Array.isArray(p_dados)) {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos para upload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (p_dados.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum dado para processar' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceRole) {
      return new Response(
        JSON.stringify({ error: 'Configuração de servidor incompleta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole)

    // We no longer need to check for existing files as we have triggers that make filenames unique
    console.log(`Processando upload para ${p_usuario_email}, arquivo: ${p_nome_arquivo}, registros: ${p_dados.length}`);
    
    // Use the database transaction function for better data consistency
    const { data: txnResult, error: txnError } = await supabase.rpc('create_painel_upload_with_data', {
      p_usuario_email,
      p_nome_arquivo,
      p_dados: JSON.stringify(p_dados)
    });
    
    if (txnError) {
      console.error('Erro na função de transação:', txnError);
      return new Response(
        JSON.stringify({ error: `Erro na função de transação: ${txnError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('Resultado da transação:', txnResult);
    
    // Return the transaction result
    return new Response(
      JSON.stringify(txnResult),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Erro na função create_painel_upload_with_data:', error);
    return new Response(
      JSON.stringify({ error: `Erro interno: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
