
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
        const { data: pendingData, error: pendingError } = await supabase
          .from('demandas')
          .select('id', { count: 'exact' })
          .eq('status', 'pendente')
          .eq('coordenacao_id', departmentId);
          
        if (!pendingError) {
          const pendingCount = pendingData?.length || 0;
          setBadgeValues(prev => ({ ...prev, 'responder-demandas': pendingCount.toString() }));
        }
        
        // Fetch demands awaiting note for "Criar Nota" badge
        const { data: awaitingNoteData, error: awaitingNoteError } = await supabase
          .from('demandas')
          .select('id', { count: 'exact' })
          .eq('status', 'respondida')
          .eq('nota_criada', false)
          .eq('coordenacao_id', departmentId);
          
        if (!awaitingNoteError) {
          const awaitingNoteCount = awaitingNoteData?.length || 0;
          setBadgeValues(prev => ({ ...prev, 'criar-nota': awaitingNoteCount.toString() }));
        }
        
        // Fetch notes awaiting approval for "Aprovar Notas" badge
        const { data: approvalData, error: awaitingApprovalError } = await supabase
          .from('notas_oficiais')
          .select('id', { count: 'exact' })
          .eq('status', 'aguardando_aprovacao')
          .eq('coordenacao_id', departmentId);
          
        if (!awaitingApprovalError) {
          const awaitingApprovalCount = approvalData?.length || 0;
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
