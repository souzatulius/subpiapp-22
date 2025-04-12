
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
    
    // Start a transaction by using the API
    // 1. Create the upload record first
    const { data: uploadData, error: uploadError } = await supabase
      .from('painel_zeladoria_uploads')
      .insert({
        usuario_email: p_usuario_email,
        nome_arquivo: p_nome_arquivo
      })
      .select('id')
      .single()
    
    if (uploadError) {
      console.error('Erro ao criar registro de upload:', uploadError)
      return new Response(
        JSON.stringify({ error: `Erro ao criar registro de upload: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const uploadId = uploadData.id
    console.log(`Upload registrado com ID: ${uploadId}`)
    
    // 2. Insert the data referencing the upload ID
    const dataToInsert = p_dados.map((item: any) => ({
      ...item,
      upload_id: uploadId
    }))
    
    const { error: insertError } = await supabase
      .from('painel_zeladoria_dados')
      .insert(dataToInsert)
    
    if (insertError) {
      console.error('Erro ao inserir dados:', insertError)
      
      // Attempt to rollback by deleting the upload record
      await supabase
        .from('painel_zeladoria_uploads')
        .delete()
        .eq('id', uploadId)
      
      return new Response(
        JSON.stringify({ error: `Erro ao inserir dados: ${insertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Return success with the upload ID
    return new Response(
      JSON.stringify(uploadId),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Erro na função create_painel_upload_with_data:', error)
    return new Response(
      JSON.stringify({ error: `Erro interno: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
