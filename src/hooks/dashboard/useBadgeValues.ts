
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
        const { data: pendingDemandsData, error: pendingDemandsError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('status', 'pendente')
          .eq('coordenacao_id', departmentId);
          
        if (!pendingDemandsError) {
          const pendingDemandsCount = pendingDemandsData?.[0]?.count || '0';
          setBadgeValues(prev => ({ ...prev, 'responder-demandas': pendingDemandsCount.toString() }));
        }
        
        // Fetch demands awaiting note for "Criar Nota" badge
        const { data: awaitingNoteData, error: awaitingNoteError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('status', 'respondida')
          .eq('nota_criada', false)
          .eq('coordenacao_id', departmentId);
          
        if (!awaitingNoteError) {
          const awaitingNoteCount = awaitingNoteData?.[0]?.count || '0';
          setBadgeValues(prev => ({ ...prev, 'criar-nota': awaitingNoteCount.toString() }));
        }
        
        // Fetch notes awaiting approval for "Aprovar Notas" badge
        const { data: awaitingApprovalData, error: awaitingApprovalError } = await supabase
          .from('notas')
          .select('count', { count: 'exact' })
          .eq('status', 'aguardando_aprovacao')
          .eq('coordenacao_id', departmentId);
          
        if (!awaitingApprovalError) {
          const awaitingApprovalCount = awaitingApprovalData?.[0]?.count || '0';
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
