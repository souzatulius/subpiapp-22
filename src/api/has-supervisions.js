
import { supabase } from '@/integrations/supabase/client';

export async function GET(request) {
  const url = new URL(request.url);
  const coordenacaoId = url.searchParams.get('coordenacao_id');
  
  if (!coordenacaoId) {
    return new Response(JSON.stringify({
      error: 'Coordenação ID é obrigatório'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { data, error, count } = await supabase
      .from('supervisoes_tecnicas')
      .select('id', { count: 'exact' })
      .eq('coordenacao_id', coordenacaoId);
      
    if (error) throw error;
    
    return new Response(JSON.stringify({
      hasSupervisions: count > 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error checking supervisions:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao verificar supervisões técnicas'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
