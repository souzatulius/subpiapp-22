
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
        // Fix: Remove the type annotation that's causing excessive recursion
        const { count: todayCount, error: todayError } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .eq('tipo', 'imprensa')
          .gte('horario_publicacao', `${todayStr}T00:00:00`)
          .lt('horario_publicacao', `${todayStr}T23:59:59`);

        const { count: yesterdayCount, error: yesterdayError } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .eq('tipo', 'imprensa')
          .gte('horario_publicacao', `${yesterdayStr}T00:00:00`)
          .lt('horario_publicacao', `${yesterdayStr}T23:59:59`);

        // Fetch pending approvals
        const { count: pendingCount, error: pendingError } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .in('status', ['aguardando_aprovacao', 'aguardando_resposta']);

        // Count how many are specifically awaiting response
        const { count: awaitingCount, error: awaitingError } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aguardando_resposta');

        // Fetch notes data
        const { count: totalNotesCount, error: totalNotesError } = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true });

        // Count approved and rejected notes
        const { count: approvedCount, error: approvedError } = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aprovada');

        const { count: rejectedCount, error: rejectedError } = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejeitada');

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
        const todayValue = todayCount ?? 0;
        const yesterdayValue = yesterdayCount ?? 0;
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
            total: pendingCount ?? 0,
            awaitingResponse: awaitingCount ?? 0,
            loading: false
          },
          notesProduced: {
            total: totalNotesCount ?? 0,
            approved: approvedCount ?? 0,
            rejected: rejectedCount ?? 0,
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
