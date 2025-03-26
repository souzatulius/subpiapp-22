
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NotaOficial, NotaEdicao } from '@/types/nota';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useNotasQuery = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [areaFilter, setAreaFilter] = useState('todas');
  const [dataInicioFilter, setDataInicioFilter] = useState<Date | undefined>(undefined);
  const [dataFimFilter, setDataFimFilter] = useState<Date | undefined>(undefined);
  
  const isAdmin = true; // Simplified for now, should be based on user roles
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  const { data: notas = [], isLoading, refetch } = useQuery({
    queryKey: ['notas', statusFilter, areaFilter, searchQuery, dataInicioFilter, dataFimFilter],
    queryFn: async () => {
      let query = supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id(id, nome_completo),
          aprovador:aprovador_id(id, nome_completo),
          supervisao_tecnica:supervisao_tecnica_id(id, descricao),
          historico_edicoes:notas_historico_edicoes(
            id,
            nota_id,
            texto_anterior,
            texto_novo,
            titulo_anterior,
            titulo_novo,
            editor_id,
            criado_em,
            editor:editor_id(id, nome_completo)
          )
        `);

      // Apply filters
      if (statusFilter && statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
      }

      if (areaFilter && areaFilter !== 'todas') {
        query = query.eq('supervisao_tecnica_id', areaFilter);
      }

      if (dataInicioFilter) {
        const startOfDay = new Date(dataInicioFilter);
        startOfDay.setHours(0, 0, 0, 0);
        query = query.gte('criado_em', startOfDay.toISOString());
      }

      if (dataFimFilter) {
        const endOfDay = new Date(dataFimFilter);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('criado_em', endOfDay.toISOString());
      }

      query = query.order('criado_em', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Process the data to match our TypeScript interfaces
      const processedData = (data || []).map(nota => {
        // Process historic edits with null safety
        const processedHistorico = (nota.historico_edicoes || []).map(edit => {
          // Safely handle editor data with null check
          const editor = edit.editor && typeof edit.editor === 'object' && !('error' in edit.editor)
            ? edit.editor
            : null;

          return {
            ...edit,
            editor // Safe null handling
          };
        }) as NotaEdicao[];

        // Safely handle author data with null check
        const autor = nota.autor && typeof nota.autor === 'object' && !('error' in nota.autor)
          ? nota.autor
          : { id: '', nome_completo: 'Não informado' };

        // Safely handle approver data with null check
        const aprovador = nota.aprovador && typeof nota.aprovador === 'object' && !('error' in nota.aprovador)
          ? nota.aprovador
          : null;

        // Safely handle technical supervision data with null check
        const supervisao_tecnica = nota.supervisao_tecnica && typeof nota.supervisao_tecnica === 'object' && !('error' in nota.supervisao_tecnica)
          ? nota.supervisao_tecnica
          : { id: '', descricao: 'Não informada' };

        return {
          ...nota,
          autor,
          aprovador,
          supervisao_tecnica,
          area_coordenacao: { id: '', descricao: supervisao_tecnica?.descricao || 'Não informada' },
          historico_edicoes: processedHistorico
        };
      }) as NotaOficial[];

      // Filter by search query
      if (searchQuery.trim()) {
        return processedData.filter(nota => 
          nota.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
          nota.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nota.autor?.nome_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (nota.supervisao_tecnica?.descricao || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return processedData;
    }
  });

  // Apply local filtering for search query if it changes and we already have data
  const filteredNotas = searchQuery.trim() && notas.length > 0
    ? notas.filter(nota => 
        nota.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
        nota.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nota.autor?.nome_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (nota.supervisao_tecnica?.descricao || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notas;

  return {
    notas,
    filteredNotas,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    formatDate,
    refetch,
    isAdmin
  };
};
