
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardKPIs {
  pressRequests: {
    today: number;
    yesterday: number;
    percentageChange: number;
    loading: boolean;
  };
  pendingApproval: {
    total: number;
    awaitingResponse: number;
    loading: boolean;
  };
  notesProduced: {
    total: number;
    approved: number;
    rejected: number;
    loading: boolean;
  };
}

export const useDashboardKPIs = () => {
  const [kpis, setKpis] = useState<DashboardKPIs>({
    pressRequests: {
      today: 0,
      yesterday: 0,
      percentageChange: 0,
      loading: true
    },
    pendingApproval: {
      total: 0,
      awaitingResponse: 0,
      loading: true
    },
    notesProduced: {
      total: 0, 
      approved: 0,
      rejected: 0,
      loading: true
    }
  });

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        // Get today and yesterday's date for comparison
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Fetch press requests data for today
        const { data: todayData, error: todayError } = await supabase
          .from('demandas')
          .select('id')
          .eq('tipo', 'imprensa')
          .gte('horario_publicacao', `${todayStr}T00:00:00`)
          .lt('horario_publicacao', `${todayStr}T23:59:59`);
          
        const todayCount = todayData?.length || 0;
          
        // Fetch press requests data for yesterday
        const { data: yesterdayData, error: yesterdayError } = await supabase
          .from('demandas')
          .select('id')
          .eq('tipo', 'imprensa')
          .gte('horario_publicacao', `${yesterdayStr}T00:00:00`)
          .lt('horario_publicacao', `${yesterdayStr}T23:59:59`);
          
        const yesterdayCount = yesterdayData?.length || 0;
          
        // Fetch pending approvals
        const { data: pendingData, error: pendingError } = await supabase
          .from('demandas')
          .select('id')
          .in('status', ['aguardando_aprovacao', 'aguardando_resposta']);
          
        const pendingCount = pendingData?.length || 0;
          
        // Count how many are specifically awaiting response
        const { data: awaitingData, error: awaitingError } = await supabase
          .from('demandas')
          .select('id')
          .eq('status', 'aguardando_resposta');
          
        const awaitingCount = awaitingData?.length || 0;
          
        // Fetch notes data
        const { data: totalNotesData, error: totalNotesError } = await supabase
          .from('notas_oficiais')
          .select('id');
          
        const totalNotesCount = totalNotesData?.length || 0;
          
        // Count approved and rejected notes
        const { data: approvedData, error: approvedError } = await supabase
          .from('notas_oficiais')
          .select('id')
          .eq('status', 'aprovada');
          
        const approvedCount = approvedData?.length || 0;
          
        const { data: rejectedData, error: rejectedError } = await supabase
          .from('notas_oficiais')
          .select('id')
          .eq('status', 'rejeitada');
          
        const rejectedCount = rejectedData?.length || 0;
          
        // Log any errors
        if (todayError || yesterdayError || pendingError || 
            awaitingError || totalNotesError || approvedError || rejectedError) {
          console.error("Error fetching KPIs", { 
            todayError, 
            yesterdayError,
            pendingError,
            awaitingError,
            notesError: totalNotesError,
            approvedError,
            rejectedError
          });
        }

        // Calculate percentage change
        let percentageChange = 0;
        if (yesterdayCount > 0) {
          percentageChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
        }

        // Update KPIs state
        setKpis({
          pressRequests: {
            today: todayCount,
            yesterday: yesterdayCount,
            percentageChange,
            loading: false
          },
          pendingApproval: {
            total: pendingCount,
            awaitingResponse: awaitingCount,
            loading: false
          },
          notesProduced: {
            total: totalNotesCount,
            approved: approvedCount,
            rejected: rejectedCount,
            loading: false
          }
        });

      } catch (error) {
        console.error('Failed to fetch dashboard KPIs:', error);
        // Set loading to false even on error to stop showing skeletons
        setKpis(prev => ({
          ...prev,
          pressRequests: { ...prev.pressRequests, loading: false },
          pendingApproval: { ...prev.pendingApproval, loading: false },
          notesProduced: { ...prev.notesProduced, loading: false }
        }));
      }
    };

    fetchKPIs();

    // Setup refresh interval - every 5 minutes
    const intervalId = setInterval(fetchKPIs, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { kpis };
};
