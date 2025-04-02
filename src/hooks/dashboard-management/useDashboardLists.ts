
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListItem } from '@/components/settings/dashboard-management/DynamicListCard';

export interface DashboardLists {
  recentDemands: {
    items: ListItem[];
    loading: boolean;
  };
  recentNotes: {
    items: ListItem[];
    loading: boolean;
  };
}

export const useDashboardLists = () => {
  const [lists, setLists] = useState<DashboardLists>({
    recentDemands: {
      items: [],
      loading: true
    },
    recentNotes: {
      items: [],
      loading: true
    }
  });

  useEffect(() => {
    const fetchListsData = async () => {
      try {
        // Fetch 5 most recent demands that are in progress
        const { data: demands, error: demandsError } = await supabase
          .from('demandas')
          .select('id, titulo, status, horario_publicacao')
          .in('status', ['em_andamento', 'aguardando_resposta', 'aguardando_aprovacao'])
          .order('horario_publicacao', { ascending: false })
          .limit(5);

        // Fetch 5 most recent official notes
        const { data: notes, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, status, criado_em')
          .order('criado_em', { ascending: false })
          .limit(5);

        if (demandsError) {
          console.error('Error fetching recent demands:', demandsError);
        }

        if (notesError) {
          console.error('Error fetching recent notes:', notesError);
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
            date: new Date(demand.horario_publicacao).toLocaleDateString('pt-BR'),
            path: `/dashboard/comunicacao/responder?demanda_id=${demand.id}`
          };
        });

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
            date: new Date(note.criado_em).toLocaleDateString('pt-BR'),
            path: `/dashboard/comunicacao/notas?nota_id=${note.id}`
          };
        });

        setLists({
          recentDemands: {
            items: formattedDemands,
            loading: false
          },
          recentNotes: {
            items: formattedNotes,
            loading: false
          }
        });

      } catch (error) {
        console.error('Failed to fetch dashboard lists data:', error);
        setLists(prev => ({
          ...prev,
          recentDemands: { ...prev.recentDemands, loading: false },
          recentNotes: { ...prev.recentNotes, loading: false }
        }));
      }
    };

    fetchListsData();

    // Setup refresh interval - every 2 minutes
    const intervalId = setInterval(fetchListsData, 2 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { lists };
};
