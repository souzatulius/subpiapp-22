
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Demanda, Resposta, NotaExistente } from '../types';

// Function to fetch nota oficial with explicit return type to prevent type recursion
async function fetchNotaOficial(demandaId: string): Promise<NotaExistente | null> {
  try {
    const { data, error } = await supabase
      .from('notas_oficiais')
      .select('id, status, titulo, texto')
      .eq('demanda_id', demandaId)
      .maybeSingle();
    
    if (error) throw error;
    
    return data as NotaExistente | null;
  } catch (error) {
    console.error("Erro ao buscar nota existente:", error);
    return null;
  }
}

export function useDemandaDetalhes(demandaId: string) {
  // Buscar detalhes da demanda
  const { data: demanda, isLoading: isLoadingDemanda } = useQuery({
    queryKey: ['demanda', demandaId],
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
          areas_coordenacao:area_coordenacao_id (id, descricao),
          autor:autor_id (nome_completo),
          perguntas
        `)
        .eq('id', demandaId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Demanda;
    },
    enabled: !!demandaId
  });
  
  // Buscar respostas da demanda
  const { data: respostas, isLoading: isLoadingRespostas } = useQuery({
    queryKey: ['respostas', demandaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('id, texto, criado_em, usuario:usuario_id (nome_completo)')
        .eq('demanda_id', demandaId);
      
      if (error) throw error;
      return data as Resposta[];
    },
    enabled: !!demandaId
  });
  
  // Breaking out the query function to prevent excessive type instantiation
  const { data: notaExistente, isLoading: isLoadingNota } = useQuery<NotaExistente | null>({
    queryKey: ['nota-oficial-existente', demandaId],
    queryFn: () => fetchNotaOficial(demandaId),
    enabled: !!demandaId
  });
  
  const isLoading = isLoadingDemanda || isLoadingRespostas || isLoadingNota;
  
  return {
    demanda,
    respostas,
    notaExistente,
    isLoading
  };
}
