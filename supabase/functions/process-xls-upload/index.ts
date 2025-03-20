
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Create a Supabase client with the service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Usuário não autorizado' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Get the uploaded file from the request body
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const fileName = file.name;
    const fileBuffer = await file.arrayBuffer();
    
    // Read the XLS/XLSX file
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Arquivo vazio ou formato inválido' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    let inseridos = 0;
    let atualizados = 0;
    
    // Process each row in the spreadsheet
    for (const row of data) {
      // Skip rows without ordem_servico
      if (!row.ordem_servico) continue;
      
      // Check if this ordem_servico already exists
      const { data: existingOrder, error: fetchError } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('ordem_servico', row.ordem_servico)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Erro ao buscar ordem existente:', fetchError);
        continue;
      }
      
      // Define the record to insert/update
      const orderRecord = {
        ordem_servico: row.ordem_servico,
        classificacao: row.classificacao || null,
        criado_em: row.criado_em ? new Date(row.criado_em) : null,
        status: row.status || null,
        dias: parseInt(row.dias) || null,
        bairro: row.bairro || null,
        distrito: row.distrito || null,
        ultima_atualizacao: new Date()
      };
      
      if (!existingOrder) {
        // Insert new record
        const { error: insertError } = await supabase
          .from('ordens_servico')
          .insert(orderRecord);
          
        if (insertError) {
          console.error('Erro ao inserir ordem:', insertError);
        } else {
          inseridos++;
        }
      } else {
        // Check if any field has changed
        let hasChanges = false;
        for (const key in orderRecord) {
          if (key === 'ultima_atualizacao') continue; // Skip this field in comparison
          if (orderRecord[key] !== existingOrder[key]) {
            hasChanges = true;
            break;
          }
        }
        
        if (hasChanges) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('ordens_servico')
            .update(orderRecord)
            .eq('id', existingOrder.id);
            
          if (updateError) {
            console.error('Erro ao atualizar ordem:', updateError);
          } else {
            atualizados++;
          }
        }
      }
    }
    
    // Log the upload
    const { error: logError } = await supabase
      .from('uploads_ordens_servico')
      .insert({
        usuario_id: user.id,
        nome_arquivo: fileName,
        registros_inseridos: inseridos,
        registros_atualizados: atualizados
      });
      
    if (logError) {
      console.error('Erro ao registrar upload:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processamento concluído. ${inseridos} registros inseridos, ${atualizados} registros atualizados.`,
        inseridos,
        atualizados
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    return new Response(
      JSON.stringify({ error: `Erro ao processar arquivo: ${error.message}` }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
