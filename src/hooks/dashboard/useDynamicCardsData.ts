
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface KpiData {
  today?: number;
  yesterday?: number;
  percentageChange?: number;
  total?: number;
  approved?: number;
  rejected?: number;
  awaitingResponse?: number;
  loading: boolean;
}

export interface ListItem {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  date?: string;
  path?: string;
}

export interface DynamicCardsData {
  kpis: {
    pressRequests: KpiData;
    pendingApproval: KpiData;
    notesProduced: KpiData;
  };
  lists: {
    recentDemands: {
      items: ListItem[];
      loading: boolean;
    };
    recentNotes: {
      items: ListItem[];
      loading: boolean;
    };
    pendingResponse: {
      items: ListItem[];
      loading: boolean;
    };
    pendingNotes: {
      items: ListItem[];
      loading: boolean;
    };
  };
  originOptions: Array<{
    id: string;
    title: string;
    icon: string;
  }>;
}

export const useDynamicCardsData = (department: string = 'comunicacao'): DynamicCardsData => {
  const { user } = useAuth();
  const [data, setData] = useState<DynamicCardsData>({
    kpis: {
      pressRequests: { loading: true },
      pendingApproval: { loading: true },
      notesProduced: { loading: true }
    },
    lists: {
      recentDemands: { items: [], loading: true },
      recentNotes: { items: [], loading: true },
      pendingResponse: { items: [], loading: true },
      pendingNotes: { items: [], loading: true }
    },
    originOptions: []
  });

  useEffect(() => {
    if (!user) return;

    const fetchKPIData = async () => {
      try {
        // Fetch press request stats
        const pressResponse = await supabase
          .from('demandas')
          .select('count', { count: 'exact', head: true })
          .eq('status', 'pendente')
          .eq('origem_id', (await supabase.from('origens_demandas').select('id').eq('descricao', 'Imprensa').single()).data?.id)
          .gte('criado_em', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

        const yesterdayResponse = await supabase
          .from('demandas')
          .select('count', { count: 'exact', head: true })
          .eq('status', 'pendente')
          .eq('origem_id', (await supabase.from('origens_demandas').select('id').eq('descricao', 'Imprensa').single()).data?.id)
          .gte('criado_em', new Date(new Date().setDate(new Date().getDate() - 1)).toISOString())
          .lt('criado_em', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
          
        // Fetch approval stats
        const approvalResponse = await supabase
          .from('demandas')
          .select('count', { count: 'exact', head: true })
          .eq('status', 'em-andamento');
        
        const awaitingResponse = await supabase
          .from('demandas')
          .select('count', { count: 'exact', head: true })
          .eq('status', 'em-andamento')
          .is('respostas_demandas.id', null)
          .not('prazo_resposta', 'is', null);

        // Fetch notes stats
        const { data: notesStats, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('status');
        
        const totalNotes = notesStats?.length || 0;
        const approved = notesStats?.filter(note => note.status === 'aprovada').length || 0;
        const rejected = notesStats?.filter(note => note.status === 'rejeitada').length || 0;

        // Calculate percentage change
        const todayCount = pressResponse.count || 0;
        const yesterdayCount = yesterdayResponse.count || 0;
        let percentageChange = 0;
        
        if (yesterdayCount > 0) {
          percentageChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
        }

        setData(prev => ({
          ...prev,
          kpis: {
            pressRequests: { 
              today: todayCount, 
              yesterday: yesterdayCount,
              percentageChange,
              loading: false 
            },
            pendingApproval: { 
              total: approvalResponse.count || 0, 
              awaitingResponse: awaitingResponse.count || 0,
              loading: false 
            },
            notesProduced: { 
              total: totalNotes,
              approved,
              rejected,
              loading: false 
            }
          }
        }));

      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    const fetchListsData = async () => {
      try {
        // Fetch recent demands
        const { data: recentDemands, error: demandsError } = await supabase
          .from('demandas')
          .select('id, titulo, status, criado_em')
          .eq('status', 'em-andamento')
          .order('criado_em', { ascending: false })
          .limit(5);

        if (demandsError) throw demandsError;

        // Fetch recent notes
        const { data: recentNotes, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, status, criado_em')
          .order('criado_em', { ascending: false })
          .limit(5);

        if (notesError) throw notesError;

        // Fetch pending responses
        const { data: pendingResponse, error: pendingError } = await supabase
          .from('demandas')
          .select('id, titulo, status, prazo_resposta')
          .eq('status', 'em-andamento')
          .is('respostas_demandas.id', null)
          .not('prazo_resposta', 'is', null)
          .order('prazo_resposta', { ascending: true })
          .limit(5);

        if (pendingError) throw pendingError;

        // Fetch demands without notes
        const { data: pendingNotes, error: pendingNotesError } = await supabase
          .from('demandas')
          .select('id, titulo, status, criado_em')
          .eq('status', 'em-andamento')
          .is('notas_oficiais.id', null)
          .order('criado_em', { ascending: false })
          .limit(5);

        if (pendingNotesError) throw pendingNotesError;

        // Format data for the lists
        setData(prev => ({
          ...prev,
          lists: {
            recentDemands: {
              items: recentDemands?.map(item => ({
                id: item.id,
                title: item.titulo,
                status: 'in-progress',
                date: new Date(item.criado_em).toLocaleDateString(),
                path: `/dashboard/comunicacao/demandas/${item.id}`
              })) || [],
              loading: false
            },
            recentNotes: {
              items: recentNotes?.map(item => ({
                id: item.id,
                title: item.titulo,
                status: item.status === 'aprovada' ? 'approved' : 
                       item.status === 'rejeitada' ? 'rejected' : 'pending',
                date: new Date(item.criado_em).toLocaleDateString(),
                path: `/dashboard/comunicacao/notas/${item.id}`
              })) || [],
              loading: false
            },
            pendingResponse: {
              items: pendingResponse?.map(item => ({
                id: item.id,
                title: item.titulo,
                status: 'pending',
                date: new Date(item.prazo_resposta).toLocaleDateString(),
                path: `/dashboard/comunicacao/responder/${item.id}`
              })) || [],
              loading: false
            },
            pendingNotes: {
              items: pendingNotes?.map(item => ({
                id: item.id,
                title: item.titulo,
                status: 'pending',
                date: new Date(item.criado_em).toLocaleDateString(),
                path: `/dashboard/comunicacao/criar-nota?demanda=${item.id}`
              })) || [],
              loading: false
            }
          }
        }));

      } catch (error) {
        console.error('Error fetching lists data:', error);
      }
    };

    const fetchOriginOptions = async () => {
      try {
        const { data: origins, error } = await supabase
          .from('origens_demandas')
          .select('id, descricao, icone');
          
        if (error) throw error;

        setData(prev => ({
          ...prev,
          originOptions: origins?.map(origin => ({
            id: origin.id,
            title: origin.descricao,
            icon: origin.icone || 'message-square'
          })) || []
        }));

      } catch (error) {
        console.error('Error fetching origin options:', error);
      }
    };

    fetchKPIData();
    fetchListsData();
    fetchOriginOptions();

  }, [user]);

  return data;
};
