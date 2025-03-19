
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Demanda, Resposta } from '../types';

// Interface simplificada para nota existente para evitar erros de tipo
interface SimpleNotaExistente {
  id: string;
  status: string;
  titulo: string;
  texto: string;
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
        .single();
      
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
  
  // Usando interface simplificada para evitar erro de tipo de instanciação profunda
  const { data: notaExistente, isLoading: isLoadingNota } = useQuery<SimpleNotaExistente | null>({
    queryKey: ['nota-oficial-existente', demandaId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select('id, status, titulo, texto')
          .eq('demanda_id', demandaId)
          .maybeSingle();
        
        if (error) throw error;
        
        return data as SimpleNotaExistente | null;
      } catch (error) {
        console.error("Erro ao buscar nota existente:", error);
        return null;
      }
    },
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
