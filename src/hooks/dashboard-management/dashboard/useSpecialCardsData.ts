
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SpecialCardData {
  overdueCount: number;
  overdueItems: { title: string; id: string }[];
  notesToApprove: number;
  responsesToDo: number;
  isLoading: boolean;
}

export const useSpecialCardsData = (): SpecialCardData => {
  const [data, setData] = useState<SpecialCardData>({
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  });

  useEffect(() => {
    const fetchData = async () => {
      setData(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Fetch overdue demands
        const { data: overdueData, error: overdueError } = await supabase
          .from('demandas')
          .select('id, titulo, status')
          .eq('status', 'ATRASADA')
          .limit(5);
          
        if (!overdueError && overdueData) {
          setData(prev => ({ 
            ...prev, 
            overdueCount: overdueData.length,
            overdueItems: overdueData.map(item => ({ 
              title: item.titulo, 
              id: item.id 
            }))
          }));
        }
        
        // Fetch notes to approve - using notas_oficiais instead of notas
        const { count: notesCount, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'PENDENTE_APROVACAO');
          
        if (!notesError) {
          setData(prev => ({ ...prev, notesToApprove: notesCount || 0 }));
        }
        
        // Fetch responses to do - using demandas instead of demandas_comunicacao
        const { count: responsesCount, error: responsesError } = await supabase
          .from('demandas')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'PENDENTE_RESPOSTA');
          
        if (!responsesError) {
          setData(prev => ({ ...prev, responsesToDo: responsesCount || 0 }));
        }
      } catch (error) {
        console.error('Error fetching special card data:', error);
      } finally {
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchData();
    
    // Set up a refresh interval
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
};
