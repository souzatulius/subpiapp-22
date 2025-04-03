
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListItem } from '@/components/settings/dashboard-management/DynamicListCard';

interface DynamicCardData {
  recentDemands?: ListItem[];
  recentNotes?: ListItem[];
  overdueCount?: number;
  pendingActionsCount?: number;
  isLoading: boolean;
}

interface FetchDataOptions {
  dataSourceKey: string;
  userCoordenaticaoId?: string | null;
  userId?: string | null;
}

export const useDynamicCardsData = (
  dataSourceKey: string,
  userCoordenaticaoId?: string | null,
  userId?: string | null
) => {
  const [data, setData] = useState<DynamicCardData>({
    isLoading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!dataSourceKey) {
        console.warn('No dataSourceKey provided to useDynamicCardsData');
        setData({ isLoading: false });
        return;
      }

      setData(prev => ({ ...prev, isLoading: true }));
      console.log(`Fetching dynamic data for source: ${dataSourceKey}`, {
        userCoordenaticaoId,
        userId,
      });

      try {
        if (dataSourceKey === 'recent_demands') {
          await fetchRecentDemands({ dataSourceKey, userCoordenaticaoId, userId });
        } else if (dataSourceKey === 'recent_notes') {
          await fetchRecentNotes({ dataSourceKey, userCoordenaticaoId, userId });
        } else if (dataSourceKey === 'in_progress_demands') {
          await fetchInProgressDemands({ dataSourceKey, userCoordenaticaoId, userId });
        } else if (dataSourceKey === 'pending_actions') {
          await fetchPendingActions({ dataSourceKey, userCoordenaticaoId, userId });
        } else {
          console.warn(`Unknown dataSourceKey: ${dataSourceKey}`);
          setData({ isLoading: false });
        }
      } catch (err) {
        console.error('Exception fetching dynamic card data:', err);
        setData({ isLoading: false });
      }
    };

    fetchData();

    // Setup refresh interval - every 2 minutes
    const intervalId = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [dataSourceKey, userCoordenaticaoId, userId]);

  const fetchRecentDemands = async (options: FetchDataOptions) => {
    try {
      // Fetch 5 most recent demands that are in progress
      const { data: demands, error: demandsError } = await supabase
        .from('demandas')
        .select('id, titulo, status, horario_publicacao')
        .in('status', ['em_andamento', 'aguardando_resposta', 'aguardando_aprovacao'])
        .order('horario_publicacao', { ascending: false })
        .limit(5);

      if (demandsError) {
        console.error('Error fetching recent demands:', demandsError);
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Format demands data
      const formattedDemands: ListItem[] = (demands || []).map(demand => {
        // Map database status to our component status
        const statusMap: Record<string, ListItem['status']> = {
          'em_andamento': 'in-progress',
          'aguardando_resposta': 'pending',
          'aguardando_aprovacao': 'pending',
          'concluida': 'completed',
          'aprovada': 'approved',
          'rejeitada': 'rejected'
        };

        return {
          id: demand.id,
          title: demand.titulo,
          status: statusMap[demand.status] || 'pending',
          date: demand.horario_publicacao ? new Date(demand.horario_publicacao).toLocaleDateString('pt-BR') : '',
          path: `/dashboard/comunicacao/responder?demanda_id=${demand.id}`
        };
      });

      setData({
        recentDemands: formattedDemands,
        isLoading: false
      });

    } catch (error) {
      console.error('Error fetching recent demands:', error);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchRecentNotes = async (options: FetchDataOptions) => {
    try {
      // Fetch 5 most recent official notes
      const { data: notes, error: notesError } = await supabase
        .from('notas_oficiais')
        .select('id, titulo, status, criado_em')
        .order('criado_em', { ascending: false })
        .limit(5);

      if (notesError) {
        console.error('Error fetching recent notes:', notesError);
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Format notes data
      const formattedNotes: ListItem[] = (notes || []).map(note => {
        // Map database status to our component status
        const statusMap: Record<string, ListItem['status']> = {
          'pendente': 'pending',
          'aprovada': 'approved',
          'rejeitada': 'rejected'
        };

        return {
          id: note.id,
          title: note.titulo,
          status: statusMap[note.status] || 'pending',
          date: note.criado_em ? new Date(note.criado_em).toLocaleDateString('pt-BR') : '',
          path: `/dashboard/comunicacao/notas?nota_id=${note.id}`
        };
      });

      setData({
        recentNotes: formattedNotes,
        isLoading: false
      });

    } catch (error) {
      console.error('Error fetching recent notes:', error);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchInProgressDemands = async (options: FetchDataOptions) => {
    try {
      const { count, error } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .in('status', ['em_andamento', 'aguardando_resposta']);

      if (error) {
        console.error('Error fetching in progress demands count:', error);
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setData({
        overdueCount: count || 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching in progress demands:', error);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchPendingActions = async (options: FetchDataOptions) => {
    try {
      // Fetch count of notes waiting for approval
      const { count: notesCount, error: notesError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');

      // Fetch count of demands needing response
      const { count: demandsCount, error: demandsError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aguardando_resposta');

      if (notesError) {
        console.error('Error fetching notes count:', notesError);
      }

      if (demandsError) {
        console.error('Error fetching demands count:', demandsError);
      }

      const totalCount = (notesCount || 0) + (demandsCount || 0);

      setData({
        pendingActionsCount: totalCount,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching pending actions:', error);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  };

  return data;
};
