
import { supabase } from '@/integrations/supabase/client';

export const fetchDemandResponse = async (demandaId: string): Promise<{ responseText: string | null, comments: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('respostas_demandas')
      .select('texto, comentarios')
      .eq('demanda_id', demandaId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching demand response:', error);
      return { responseText: null, comments: null };
    }

    return { 
      responseText: data?.texto || null,
      comments: data?.comentarios || null
    };
  } catch (e) {
    console.error('Exception in fetchDemandResponse:', e);
    return { responseText: null, comments: null };
  }
};
