
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const url = new URL(req.url);
    const coordenacaoId = url.searchParams.get('coordenacao_id');
    
    if (!coordenacaoId) {
      return new Response(
        JSON.stringify({ error: 'Coordenação ID é obrigatório' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { data, error, count } = await supabaseClient
      .from('supervisoes_tecnicas')
      .select('id', { count: 'exact' })
      .eq('coordenacao_id', coordenacaoId);
      
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ hasSupervisions: count > 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking supervisions:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao verificar supervisões técnicas' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
