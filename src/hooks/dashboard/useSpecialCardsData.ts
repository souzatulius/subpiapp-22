
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useSpecialCardsData = () => {
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [overdueItems, setOverdueItems] = useState<{ title: string; id: string }[]>([]);
  const [notesToApprove, setNotesToApprove] = useState<number>(0);
  const [responsesToDo, setResponsesToDo] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSpecialCardsData = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;
        
        // 1. Fetch overdue demands
        const now = new Date().toISOString();
        const { data: overdueData, error: overdueError } = await supabase
          .from('demandas')
          .select('id, titulo')
          .lt('prazo_resposta', now)
          .neq('status', 'concluido')
          .neq('status', 'cancelado')
          .order('prazo_resposta', { ascending: true })
          .limit(5);
          
        if (overdueError) {
          console.error('Error fetching overdue demands:', overdueError);
        } else {
          setOverdueCount(overdueData.length);
          setOverdueItems(overdueData.map(item => ({ title: item.titulo, id: item.id })));
        }
        
        // 2. Fetch notes waiting for approval (if user has permission)
        const { data: notesData, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id')
          .eq('status', 'pendente')
          .limit(10);
          
        if (notesError) {
          console.error('Error fetching notes to approve:', notesError);
        } else {
          setNotesToApprove(notesData.length);
        }
        
        // 3. Fetch demands waiting for response from this user area
        if (user.id) {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('area_coordenacao_id')
            .eq('id', user.id)
            .single();
          
          if (!userError && userData?.area_coordenacao_id) {
            const { data: responsesData, error: responsesError } = await supabase
              .from('demandas')
              .select('id')
              .eq('area_coordenacao_id', userData.area_coordenacao_id)
              .eq('status', 'em_analise')
              .limit(10);
              
            if (!responsesError) {
              setResponsesToDo(responsesData.length);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetching special cards data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpecialCardsData();
    
    // Setup refresh interval
    const intervalId = setInterval(fetchSpecialCardsData, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  return {
    overdueCount,
    overdueItems,
    notesToApprove, 
    responsesToDo,
    isLoading
  };
};
