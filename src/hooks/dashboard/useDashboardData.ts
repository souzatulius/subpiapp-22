
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataSourceKey } from '@/types/dashboard';

export const useDashboardData = (
  dataSourceKey: DataSourceKey,
  coordenacaoId: string,
  usuarioId: string
) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!dataSourceKey) {
        console.warn('No dataSourceKey provided to useDashboardData');
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log(`Fetching data for source: ${dataSourceKey}, coord: ${coordenacaoId}, user: ${usuarioId}`);
      
      let query;
      let mockData: any[] = [];
      let useMock = false;

      switch (dataSourceKey) {
        case 'pendencias_por_coordenacao':
          query = supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('status', 'pendente')
            .eq('coordenacao_id', coordenacaoId);
          mockData = Array.from({length: 7}, (_, i) => ({
            id: `mock-${i}`,
            titulo: `Demanda pendente mock ${i+1}`,
            prazo_resposta: new Date().toISOString()
          }));
          useMock = true;
          break;

        case 'notas_aguardando_aprovacao':
          query = supabase
            .from('notas_oficiais')
            .select('id, titulo, criado_em')
            .eq('status', 'pendente')
            .eq('aprovador_id', usuarioId);
          mockData = Array.from({length: 3}, (_, i) => ({
            id: `mock-${i}`,
            titulo: `Nota aguardando aprovação ${i+1}`,
            criado_em: new Date().toISOString()
          }));
          useMock = true;
          break;

        case 'respostas_atrasadas':
          query = supabase
            .rpc('respostas_atrasadas_por_coordenacao', { p_coordenacao_id: coordenacaoId });
          mockData = Array.from({length: 2}, (_, i) => ({
            id: `mock-${i}`,
            titulo: `Resposta atrasada ${i+1}`
          }));
          useMock = true;
          break;

        case 'demandas_aguardando_nota':
          query = supabase
            .from('demandas')
            .select('id, titulo')
            .eq('status', 'aguardando_nota')
            .eq('coordenacao_id', coordenacaoId);
          mockData = Array.from({length: 5}, (_, i) => ({
            id: `mock-${i}`,
            titulo: `Demanda aguardando nota ${i+1}`
          }));
          useMock = true;
          break;

        case 'ultimas_acoes_coordenacao':
          query = supabase
            .from('historico_demandas')
            .select('id, evento, timestamp')
            .eq('coordenacao_id', coordenacaoId)
            .order('timestamp', { ascending: false })
            .limit(5);
          mockData = Array.from({length: 5}, (_, i) => ({
            id: `mock-${i}`,
            evento: `Ação de coordenação ${i+1}`,
            timestamp: new Date().toISOString()
          }));
          useMock = true;
          break;

        case 'comunicados_por_cargo':
          query = supabase
            .from('comunicados')
            .select('id, titulo, data_envio')
            .ilike('destinatarios', `%${coordenacaoId}%`);
          mockData = Array.from({length: 4}, (_, i) => ({
            id: `mock-${i}`,
            titulo: `Comunicado mock ${i+1}`,
            data_envio: new Date().toISOString()
          }));
          useMock = true;
          break;

        default:
          console.warn(`Unknown dataSourceKey: ${dataSourceKey}`);
          useMock = true;
          mockData = Array.from({length: 3}, (_, i) => ({
            id: `mock-${i}`,
            titulo: `Item ${i+1}`,
          }));
          break;
      }

      try {
        if (!query || useMock) {
          console.log(`Using mock data for: ${dataSourceKey}`);
          setData(mockData);
          setLoading(false);
          return;
        }

        const { data: realData, error } = await query;

        if (error) {
          console.error('Erro ao buscar dados do dashboard:', error);
          // Fall back to mock data on error
          setData(mockData);
        } else {
          console.log(`Data loaded for ${dataSourceKey}:`, realData);
          setData(realData || []);
        }
      } catch (err) {
        console.error('Exception fetching dashboard data:', err);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [dataSourceKey, coordenacaoId, usuarioId]);

  return { data, loading };
};
