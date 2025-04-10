
import { supabase } from '@/integrations/supabase/client';

export const fetchDemandResponse = async (demandaId: string): Promise<string | null> => {
  try {
    console.log("Fetching response for demand:", demandaId);
    
    const { data, error } = await supabase
      .from('respostas_demandas')
      .select('texto')
      .eq('demanda_id', demandaId)
      .limit(1);
    
    if (error) {
      console.error('Error fetching demand response:', error);
      throw error;
    }
    
    if (data && data.length > 0 && data[0].texto) {
      console.log("Response found");
      return data[0].texto;
    }
    
    console.log("No response found");
    return null;
  } catch (error) {
    console.error('Error in fetchDemandResponse:', error);
    return null;
  }
};
