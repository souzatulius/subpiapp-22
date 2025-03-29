import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type DataSourceKey =
  | 'pendencias_por_coordenacao'
  | 'tarefas_por_status'
  | 'notas_aguardando_aprovacao'
  | 'respostas_atrasadas'
  | 'demandas_aguardando_nota'
  | 'ultimas_acoes_coordenacao'
  | 'comunicados_por_cargo';

export const useDashboardData = (
  dataSourceKey: DataSourceKey,
  coordenacaoId: string,
  usuarioId: string
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query;

      switch (dataSourceKey) {
        case 'pendencias_por_coordenacao':
          query = supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('status', 'pendente')
            .eq('coordenacao_id', coordenacaoId);
          break;

        case 'notas_aguardando_aprovacao':
          query = supabase
            .from('notas_oficiais')
            .select('id, titulo, criado_em')
            .eq('status', 'pendente')
            .eq('aprovador_id', usuarioId);
          break;

        case 'respostas_atrasadas':
          query = supabase
            .rpc('respostas_atrasadas_por_coordenacao', { p_coordenacao_id: coordenacaoId });
          break;

        case 'demandas_aguardando_nota':
          query = supabase
            .from('demandas')
            .select('id, titulo')
            .eq('status', 'aguardando_nota')
            .eq('coordenacao_id', coordenacaoId);
          break;

        case 'ultimas_acoes_coordenacao':
          query = supabase
            .from('historico_demandas')
            .select('id, evento, timestamp')
            .eq('coordenacao_id', coordenacaoId)
            .order('timestamp', { ascending: false })
            .limit(5);
          break;

        case 'comunicados_por_cargo':
          query = supabase
            .from('comunicados')
            .select('id, titulo, data_envio')
            .ilike('destinatarios', `%${coordenacaoId}%`);
          break;

        default:
          break;
      }

      if (!query) return;

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } else {
        setData(data);
      }

      setLoading(false);
    };

    if (coordenacaoId) {
      fetch();
    }
  }, [dataSourceKey, coordenacaoId, usuarioId]);

  return { data, loading };
};
