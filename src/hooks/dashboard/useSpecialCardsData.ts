
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface OverdueItem {
  title: string;
  id: string;
}

export const useSpecialCardsData = () => {
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [overdueItems, setOverdueItems] = useState<OverdueItem[]>([]);
  const [notesToApprove, setNotesToApprove] = useState<number>(0);
  const [responsesToDo, setResponsesToDo] = useState<number>(0);
  const [demandsNeedingNota, setDemandsNeedingNota] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);
  const [isComunicacao, setIsComunicacao] = useState<boolean>(false);
  
  const { user } = useAuth();
  
  // First fetch user's coordination
  useEffect(() => {
    const fetchUserCoordination = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user coordination:', error);
          return;
        }
        
        if (data) {
          setUserCoordenaticaoId(data.coordenacao_id);
          
          // Check if user is from communication or cabinet departments
          const isComm = data.coordenacao_id === 'comunicacao' || data.coordenacao_id === 'gabinete';
          setIsComunicacao(isComm);
        }
      } catch (error) {
        console.error('Failed to fetch user coordination:', error);
      }
    };
    
    fetchUserCoordination();
  }, [user]);
  
  // Then fetch dashboard data based on the coordination
  useEffect(() => {
    const fetchSpecialCardsData = async () => {
      try {
        setIsLoading(true);
        
        if (!user || !userCoordenaticaoId) return;
        
        // Different data gathering based on user department
        if (isComunicacao) {
          // 1. For communication/cabinet team: fetch all demands and notes across departments
          
          // Fetch all pending demands (not filtered by department)
          const { data: pendingDemandsData, error: pendingError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .in('status', ['em_analise', 'aberta'])
            .order('prazo_resposta', { ascending: true })
            .limit(10);
            
          if (!pendingError) {
            setResponsesToDo(pendingDemandsData?.length || 0);
            setOverdueItems(
              (pendingDemandsData || []).map(item => ({ 
                title: item.titulo, 
                id: item.id 
              }))
            );
            setOverdueCount(pendingDemandsData?.length || 0);
          }
          
          // Fetch all notes pending approval (not filtered by department)
          const { data: notesData, error: notesError } = await supabase
            .from('notas_oficiais')
            .select('id')
            .eq('status', 'pendente');
            
          if (!notesError) {
            setNotesToApprove(notesData?.length || 0);
          }
          
          // Fetch demands that need notes
          const { data: needsNotaData, error: needsNotaError } = await supabase
            .from('demandas')
            .select('id')
            .eq('status', 'respondida')
            .is('nota_oficial_id', null);
            
          if (!needsNotaError) {
            setDemandsNeedingNota(needsNotaData?.length || 0);
          }
        } else {
          // 2. For other departments: only show their own demands/notes
          
          // Fetch demands assigned to this department
          const { data: departmentDemands, error: departmentError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('coordenacao_id', userCoordenaticaoId)
            .order('prazo_resposta', { ascending: true })
            .limit(5);
            
          if (!departmentError) {
            setOverdueCount(departmentDemands?.length || 0);
            setOverdueItems(
              (departmentDemands || []).map(item => ({ 
                title: item.titulo, 
                id: item.id 
              }))
            );
          }
          
          // Fetch demands needing response from this department
          const { data: responsesData, error: responsesError } = await supabase
            .from('demandas')
            .select('id')
            .eq('coordenacao_id', userCoordenaticaoId)
            .eq('status', 'em_analise')
            .limit(10);
            
          if (!responsesError) {
            setResponsesToDo(responsesData?.length || 0);
          }
          
          // Fetch notes waiting for approval by this department
          const { data: notesData, error: notesError } = await supabase
            .from('notas_oficiais')
            .select('id')
            .eq('status', 'pendente')
            .eq('coordenacao_id', userCoordenaticaoId)
            .limit(10);
            
          if (!notesError) {
            setNotesToApprove(notesData?.length || 0);
          }
        }
      } catch (error) {
        console.error('Error in fetching special cards data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userCoordenaticaoId) {
      fetchSpecialCardsData();
    }
    
    // Setup refresh interval
    const intervalId = setInterval(fetchSpecialCardsData, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [user, userCoordenaticaoId, isComunicacao]);
  
  return {
    overdueCount,
    overdueItems,
    notesToApprove, 
    responsesToDo,
    demandsNeedingNota,
    isLoading,
    isComunicacao,
    userCoordenaticaoId
  };
};
