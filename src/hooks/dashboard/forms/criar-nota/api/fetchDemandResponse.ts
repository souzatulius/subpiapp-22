
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Fetches the response for a specific demand
 */
export const fetchDemandResponse = async (demandaId: string) => {
  try {
    const { data, error } = await supabase
      .from('respostas_demandas')
      .select('*')
      .eq('demanda_id', demandaId)
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data[0].texto;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao carregar respostas da demanda:', error);
    toast({
      title: "Erro ao carregar respostas",
      description: "Não foi possível carregar as respostas da demanda.",
      variant: "destructive"
    });
    return null;
  }
};
