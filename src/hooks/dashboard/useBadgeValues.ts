
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BadgeValues {
  [key: string]: string;
}

export const useBadgeValues = (departmentId: string) => {
  const [badgeValues, setBadgeValues] = useState<BadgeValues>({
    'responder-demandas': '0',
    'criar-nota': '0',
    'aprovar-notas': '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadgeValues = async () => {
      setIsLoading(true);
      
      try {
        // Fetch pending demands count for "Responder Demandas" badge
        const pendingDemandsQuery = await supabase
          .from('demandas')
          .select('id', { count: 'exact', head: false })
          .eq('status', 'pendente')
          .eq('coordenacao_id', departmentId);
          
        if (pendingDemandsQuery.count !== null) {
          const pendingDemandsCount = pendingDemandsQuery.count;
          setBadgeValues(prev => ({ ...prev, 'responder-demandas': pendingDemandsCount.toString() }));
        }
        
        // Fetch demands awaiting note for "Criar Nota" badge
        const awaitingNoteQuery = await supabase
          .from('demandas')
          .select('id', { count: 'exact', head: false })
          .eq('status', 'respondida')
          .eq('nota_criada', false)
          .eq('coordenacao_id', departmentId);
          
        if (awaitingNoteQuery.count !== null) {
          const awaitingNoteCount = awaitingNoteQuery.count;
          setBadgeValues(prev => ({ ...prev, 'criar-nota': awaitingNoteCount.toString() }));
        }
        
        // Fetch notes awaiting approval for "Aprovar Notas" badge
        const awaitingApprovalQuery = await supabase
          .from('notas_oficiais')
          .select('id', { count: 'exact', head: false })
          .eq('status', 'aguardando_aprovacao')
          .eq('coordenacao_id', departmentId);
          
        if (awaitingApprovalQuery.count !== null) {
          const awaitingApprovalCount = awaitingApprovalQuery.count;
          setBadgeValues(prev => ({ ...prev, 'aprovar-notas': awaitingApprovalCount.toString() }));
        }
      } catch (error) {
        console.error('Error fetching badge values:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (departmentId) {
      fetchBadgeValues();
    } else {
      setIsLoading(false);
    }
  }, [departmentId]);

  return { badgeValues, isLoading };
};
