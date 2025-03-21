
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useSpecialCardsData = () => {
  const { user } = useAuth();
  const [overdueCount, setOverdueCount] = useState(0);
  const [overdueItems, setOverdueItems] = useState<{ title: string; id: string }[]>([]);
  const [notesToApprove, setNotesToApprove] = useState(0);
  const [responsesToDo, setResponsesToDo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialCardsData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch overdue demands
        const today = new Date();
        const { data: overdueData, error: overdueError } = await supabase
          .from('demandas')
          .select('id, titulo')
          .lt('prazo_resposta', today.toISOString())
          .neq('status', 'concluida')
          .neq('status', 'nota_aprovada')
          .order('prazo_resposta', { ascending: true })
          .limit(10);
          
        if (!overdueError) {
          setOverdueCount(overdueData.length);
          setOverdueItems(overdueData.slice(0, 3).map(item => ({
            id: item.id,
            title: item.titulo
          })));
        }
        
        // Check if user is admin to fetch notes to approve
        const { data: isAdminData } = await supabase
          .rpc('is_admin', { user_id: user.id });
          
        if (isAdminData) {
          // Fetch notes that need approval
          const { data: pendingNotes, error: notesError } = await supabase
            .from('notas_oficiais')
            .select('id')
            .eq('status', 'pendente');
            
          if (!notesError) {
            setNotesToApprove(pendingNotes?.length || 0);
          }
        }
        
        // Fetch demands that need response
        const { data: responsesNeeded, error: responsesError } = await supabase
          .from('demandas')
          .select('id')
          .eq('status', 'em_analise');
          
        if (!responsesError) {
          setResponsesToDo(responsesNeeded?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching special cards data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpecialCardsData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchSpecialCardsData, 5 * 60 * 1000);
    
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
