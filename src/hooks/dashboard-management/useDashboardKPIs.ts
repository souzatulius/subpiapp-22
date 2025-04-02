
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
        const { data: todayRequests, error: todayError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('tipo', 'imprensa')
          .gte('created_at', `${todayStr}T00:00:00`)
          .lt('created_at', `${todayStr}T23:59:59`);

        const { data: yesterdayRequests, error: yesterdayError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('tipo', 'imprensa')
          .gte('created_at', `${yesterdayStr}T00:00:00`)
          .lt('created_at', `${yesterdayStr}T23:59:59`);

        // Fetch pending approvals
        const { data: pendingApproval, error: pendingError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .in('status', ['aguardando_aprovacao', 'aguardando_resposta']);

        // Count how many are specifically awaiting response
        const { data: awaitingResponse, error: awaitingError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('status', 'aguardando_resposta');

        // Fetch notes data
        const { data: totalNotes, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('count, status', { count: 'exact' });

        // Count approved and rejected notes
        const { data: approvedNotes, error: approvedError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'aprovada');

        const { data: rejectedNotes, error: rejectedError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'rejeitada');

        // If there were any errors, log them but continue
        if (todayError || yesterdayError || pendingError || 
            awaitingError || notesError || approvedError || rejectedError) {
          console.error("Error fetching KPIs", { 
            todayError, yesterdayError, pendingError, 
            awaitingError, notesError, approvedError, rejectedError 
          });
        }

        // Calculate percentage change
        const todayCount = todayRequests?.count || 0;
        const yesterdayCount = yesterdayRequests?.count || 0;
        const percentageChange = yesterdayCount === 0 
          ? 0 
          : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

        // Update KPIs state
        setKpis({
          pressRequests: {
            today: todayCount,
            yesterday: yesterdayCount,
            percentageChange,
            loading: false
          },
          pendingApproval: {
            total: pendingApproval?.count || 0,
            awaitingResponse: awaitingResponse?.count || 0,
            loading: false
          },
          notesProduced: {
            total: totalNotes?.count || 0,
            approved: approvedNotes?.count || 0,
            rejected: rejectedNotes?.count || 0,
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
