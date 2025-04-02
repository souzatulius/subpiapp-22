
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

        // Fetch press requests data
        const todayResult = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .eq('tipo', 'imprensa')
          .gte('horario_publicacao', `${todayStr}T00:00:00`)
          .lt('horario_publicacao', `${todayStr}T23:59:59`);
          
        const todayCount = todayResult.count || 0;
        const todayError = todayResult.error;

        const yesterdayResult = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .eq('tipo', 'imprensa')
          .gte('horario_publicacao', `${yesterdayStr}T00:00:00`)
          .lt('horario_publicacao', `${yesterdayStr}T23:59:59`);
          
        const yesterdayCount = yesterdayResult.count || 0;
        const yesterdayError = yesterdayResult.error;

        // Fetch pending approvals
        const pendingResult = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .in('status', ['aguardando_aprovacao', 'aguardando_resposta']);
          
        const pendingCount = pendingResult.count || 0;
        const pendingError = pendingResult.error;

        // Count how many are specifically awaiting response
        const awaitingResult = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aguardando_resposta');
          
        const awaitingCount = awaitingResult.count || 0;
        const awaitingError = awaitingResult.error;

        // Fetch notes data
        const totalNotesResult = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true });
          
        const totalNotesCount = totalNotesResult.count || 0;
        const totalNotesError = totalNotesResult.error;

        // Count approved and rejected notes
        const approvedResult = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aprovada');
          
        const approvedCount = approvedResult.count || 0;
        const approvedError = approvedResult.error;

        const rejectedResult = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejeitada');
          
        const rejectedCount = rejectedResult.count || 0;
        const rejectedError = rejectedResult.error;

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
        const todayValue = todayCount;
        const yesterdayValue = yesterdayCount;
        const percentageChange = yesterdayValue === 0 
          ? 0 
          : ((todayValue - yesterdayValue) / yesterdayValue) * 100;

        // Update KPIs state
        setKpis({
          pressRequests: {
            today: todayValue,
            yesterday: yesterdayValue,
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
