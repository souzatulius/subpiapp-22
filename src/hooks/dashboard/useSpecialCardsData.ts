
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface OverdueItem {
  title: string;
  id: string;
  deadline?: string;
  priority?: string;
}

interface ActivityItem {
  id: string;
  title: string;
  date: Date;
  type: string;
  status?: string;
}

export const useSpecialCardsData = () => {
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [overdueItems, setOverdueItems] = useState<OverdueItem[]>([]);
  const [notesToApprove, setNotesToApprove] = useState<number>(0);
  const [responsesToDo, setResponsesToDo] = useState<number>(0);
  const [demandsNeedingNota, setDemandsNeedingNota] = useState<number>(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
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
          .maybeSingle();
          
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
            .select('id, titulo, prazo_resposta, prioridade')
            .in('status', ['em_analise', 'aberta'])
            .order('prazo_resposta', { ascending: true })
            .limit(10);
            
          if (!pendingError) {
            setResponsesToDo(pendingDemandsData?.length || 0);
            setOverdueItems(
              (pendingDemandsData || []).map(item => ({ 
                title: item.titulo, 
                id: item.id,
                deadline: new Date(item.prazo_resposta).toLocaleDateString('pt-BR'),
                priority: item.prioridade
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
          
          // Fetch recent activities
          const { data: activitiesData, error: activitiesError } = await supabase
            .from('historico_demandas')
            .select('id, evento, timestamp, demanda_id, detalhes')
            .order('timestamp', { ascending: false })
            .limit(5);
            
          if (!activitiesError && activitiesData) {
            const formattedActivities: ActivityItem[] = activitiesData.map(activity => ({
              id: activity.id,
              title: formatActivityTitle(activity.evento, activity.detalhes),
              date: new Date(activity.timestamp),
              type: mapEventTypeToCategory(activity.evento),
              status: 'in-progress'
            }));
            setActivities(formattedActivities);
          }
        } else {
          // 2. For other departments: only show their own demands/notes
          
          // Fetch demands assigned to this department
          const { data: departmentDemands, error: departmentError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta, prioridade')
            .eq('coordenacao_id', userCoordenaticaoId)
            .order('prazo_resposta', { ascending: true })
            .limit(5);
            
          if (!departmentError) {
            setOverdueCount(departmentDemands?.length || 0);
            setOverdueItems(
              (departmentDemands || []).map(item => ({ 
                title: item.titulo, 
                id: item.id,
                deadline: new Date(item.prazo_resposta).toLocaleDateString('pt-BR'),
                priority: item.prioridade
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
          
          // Fetch recent activities for this department
          const { data: activitiesData, error: activitiesError } = await supabase
            .from('historico_demandas')
            .select('id, evento, timestamp, demanda_id, detalhes')
            .eq('coordenacao_id', userCoordenaticaoId)
            .order('timestamp', { ascending: false })
            .limit(5);
            
          if (!activitiesError && activitiesData) {
            const formattedActivities: ActivityItem[] = activitiesData.map(activity => ({
              id: activity.id,
              title: formatActivityTitle(activity.evento, activity.detalhes),
              date: new Date(activity.timestamp),
              type: mapEventTypeToCategory(activity.evento),
              status: 'in-progress'
            }));
            setActivities(formattedActivities);
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
  
  // Helper function to map event types to visual categories
  const mapEventTypeToCategory = (eventType: string): string => {
    const eventCategories: { [key: string]: string } = {
      'nota_criada': 'Nota',
      'nota_aprovada': 'Nota',
      'nota_rejeitada': 'Nota',
      'criada': 'Demanda',
      'em_analise': 'Demanda',
      'respondida': 'Resposta',
      'concluida': 'Concluída',
      'default': 'Atividade'
    };
    
    return eventCategories[eventType] || eventCategories['default'];
  };
  
  // Helper function to format activity titles
  const formatActivityTitle = (evento: string, detalhes: any): string => {
    switch (evento) {
      case 'nota_criada':
        return `Nota criada: ${detalhes?.titulo || 'Nova nota'}`;
      case 'nota_aprovada':
        return 'Nota aprovada';
      case 'nota_rejeitada':
        return 'Nota rejeitada';
      case 'criada':
        return `Nova demanda: ${detalhes?.titulo || 'Demanda sem título'}`;
      case 'em_analise':
        return 'Demanda em análise';
      case 'respondida':
        return 'Resposta enviada';
      case 'concluida':
        return 'Demanda concluída';
      default:
        return `${evento.charAt(0).toUpperCase() + evento.slice(1).replace('_', ' ')}`;
    }
  };
  
  return {
    overdueCount,
    overdueItems,
    notesToApprove, 
    responsesToDo,
    demandsNeedingNota,
    activities,
    isLoading,
    isComunicacao,
    userCoordenaticaoId
  };
};
