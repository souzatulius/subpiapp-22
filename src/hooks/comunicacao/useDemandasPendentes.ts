
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface DemandaPendente {
  id: string;
  titulo: string;
  prazo_resposta: string;
  origem_id: string;
  origem: {
    descricao: string;
  };
}

export const useDemandasPendentes = () => {
  const [demandasPendentes, setDemandasPendentes] = useState<DemandaPendente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDemandasPendentes = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Get demands without responses that need attention
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            prazo_resposta,
            origem_id,
            origem:origens_demandas(descricao)
          `)
          .eq('status', 'aberta')
          .order('prazo_resposta', { ascending: true })
          .limit(10);

        if (error) throw error;
        
        if (!data || data.length === 0) {
          setDemandasPendentes([]);
          return;
        }

        // Now get demandas that already have responses to filter them out
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select('demanda_id');

        if (respostasError) throw respostasError;
        
        // Create a set of demand IDs that already have responses
        const respondedDemandIds = new Set(respostasData?.map(resposta => resposta.demanda_id) || []);
        
        // Filter out demands that already have responses
        const filteredDemandas = data.filter(demanda => !respondedDemandIds.has(demanda.id));
        
        setDemandasPendentes(filteredDemandas || []);
      } catch (error) {
        console.error('Erro ao carregar demandas pendentes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandasPendentes();

    // Set up real-time subscription for pending demands
    const subscription = supabase
      .channel('demandas_pendentes_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'demandas',
          filter: 'status=eq.aberta'
        }, 
        () => {
          fetchDemandasPendentes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { demandasPendentes, isLoading };
};
