
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NotaOficial } from '@/types/nota';

export interface UseNotasQueryResult {
  notas: NotaOficial[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

export const useNotasQuery = (status?: string, searchTerm?: string): UseNotasQueryResult => {
  const {
    data: notasRaw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notas', status, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor_id,
          aprovador_id,
          problema_id,
          problema:problema_id (
            id, 
            descricao,
            coordenacao_id,
            coordenacao:coordenacao_id (
              id,
              descricao
            )
          ),
          demanda_id,
          demanda:demanda_id (id, titulo)
        `)
        .order('criado_em', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (searchTerm) {
        query = query.ilike('titulo', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }

      return data || [];
    }
  });

  // Transform the data to match our NotaOficial type
  const notas: NotaOficial[] = (notasRaw || []).map(nota => {
    // Use any to bypass type errors with dynamic data
    const rawNota = nota as any;
    
    return {
      id: rawNota.id || '',
      titulo: rawNota.titulo || '',
      conteudo: rawNota.texto || '', // Map texto to conteudo for compatibility
      texto: rawNota.texto || '',
      status: rawNota.status || '',
      criado_em: rawNota.criado_em || new Date().toISOString(),
      atualizado_em: rawNota.atualizado_em || rawNota.updated_at,
      autor: {
        id: rawNota.autor_id || '',
        nome_completo: 'Usuário',
      },
      aprovador: rawNota.aprovador_id ? {
        id: rawNota.aprovador_id,
        nome_completo: 'Aprovador'
      } : undefined,
      problema: rawNota.problema ? {
        id: rawNota.problema.id || '',
        descricao: rawNota.problema.descricao || '',
        coordenacao: rawNota.problema.coordenacao
      } : undefined,
      demanda: rawNota.demanda || undefined,
      area_coordenacao: rawNota.problema?.coordenacao ? {
        id: rawNota.problema.coordenacao.id || '',
        descricao: rawNota.problema.coordenacao.descricao || 'Não informada'
      } : {
        id: '',
        descricao: 'Não informada'
      },
      historico_edicoes: [],
    };
  });

  return {
    notas,
    isLoading,
    error,
    refetch
  };
};
