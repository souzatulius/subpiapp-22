
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

    // Check for duplicate filename
    const { data: existingFile, error: checkError } = await supabase
      .from('painel_zeladoria_uploads')
      .select('id, nome_arquivo')
      .eq('nome_arquivo', p_nome_arquivo)
      .limit(1)

    if (checkError) {
      console.error('Erro ao verificar arquivo existente:', checkError)
      return new Response(
        JSON.stringify({ error: `Erro ao verificar arquivo existente: ${checkError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If file already exists, append timestamp to make it unique
    let uniqueFilename = p_nome_arquivo
    if (existingFile && existingFile.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileExtension = p_nome_arquivo.lastIndexOf('.') > 0 
        ? p_nome_arquivo.substring(p_nome_arquivo.lastIndexOf('.'))
        : ''
      const fileName = p_nome_arquivo.lastIndexOf('.') > 0
        ? p_nome_arquivo.substring(0, p_nome_arquivo.lastIndexOf('.'))
        : p_nome_arquivo
        
      uniqueFilename = `${fileName}_${timestamp}${fileExtension}`
      console.log(`Arquivo já existente. Usando nome único: ${uniqueFilename}`)
    }
    
    // Start a transaction by using the API
    // 1. Create the upload record first
    const { data: uploadData, error: uploadError } = await supabase
      .from('painel_zeladoria_uploads')
      .insert({
        usuario_email: p_usuario_email,
        nome_arquivo: uniqueFilename
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
      upload_id: uploadId,
      responsavel_classificado: item.responsavel_classificado || 'subprefeitura'
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
    
    // Return success with the upload ID and original filename
    return new Response(
      JSON.stringify({ 
        id: uploadId, 
        nome_arquivo: uniqueFilename,
        original_filename: p_nome_arquivo,
        record_count: dataToInsert.length
      }),
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
