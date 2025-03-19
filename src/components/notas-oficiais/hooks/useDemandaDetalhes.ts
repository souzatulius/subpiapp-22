
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Demanda, Resposta, NotaExistente } from '../types';

export function useDemandaDetalhes(demandaId: string) {
  const { data: demanda, isLoading: demandaLoading } = useQuery<Demanda>({
    queryKey: ['demanda-detalhes', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demandas')
        .select(`
          id,
          titulo,
          status,
          horario_publicacao,
          prazo_resposta,
          detalhes_solicitacao,
          perguntas,
          arquivo_url,
          area_coordenacao:area_coordenacao_id (id, descricao),
          autor:autor_id (nome_completo)
        `)
        .eq('id', demandaId)
        .single();
      
      if (error) throw error;
      return data as Demanda;
    }
  });
  
  const { data: respostas, isLoading: respostasLoading } = useQuery<Resposta[]>({
    queryKey: ['respostas-demanda', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select(`
          id,
          texto,
          arquivo_url,
          criado_em,
          usuario:usuario_id (nome_completo)
        `)
        .eq('demanda_id', demandaId);
      
      if (error) throw error;
      return (data || []) as Resposta[];
    }
  });
  
  // Fixed by explicit typecasting to break the recursive type inference
  const { data: notaExistente } = useQuery<NotaExistente | null>({
    queryKey: ['nota-oficial-existente', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select('*')
        .eq('demanda_id', demandaId);
      
      if (error) throw error;
      return data && data.length > 0 ? data[0] as NotaExistente : null;
    }
  });

  const isLoading = demandaLoading || respostasLoading;
  
  return {
    demanda,
    respostas,
    notaExistente,
    isLoading
  };
}
