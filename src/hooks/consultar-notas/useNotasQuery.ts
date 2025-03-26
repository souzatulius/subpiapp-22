
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NotaOficial, NotaEdicao } from '@/types/nota';

export const useNotasQuery = (
  statusFilter: string,
  areaFilter: string,
  searchQuery: string,
  dataInicioFilter?: Date,
  dataFimFilter?: Date
) => {
  return useQuery({
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
        // Process historic edits
        const processedHistorico = (nota.historico_edicoes || []).map(edit => {
          // Safely handle editor data
          const editor = edit.editor && typeof edit.editor === 'object' && !('error' in edit.editor)
            ? edit.editor
            : null;

          return {
            ...edit,
            editor
          };
        }) as NotaEdicao[];

        // Safely handle author data
        const autor = nota.autor && typeof nota.autor === 'object' && !('error' in nota.autor)
          ? nota.autor
          : { id: '', nome_completo: 'Não informado' };

        // Safely handle approver data
        const aprovador = nota.aprovador && typeof nota.aprovador === 'object' && !('error' in nota.aprovador)
          ? nota.aprovador
          : { id: '', nome_completo: 'Não informado' };

        // Safely handle technical supervision data
        const supervisao_tecnica = nota.supervisao_tecnica && typeof nota.supervisao_tecnica === 'object' && !('error' in nota.supervisao_tecnica)
          ? nota.supervisao_tecnica
          : { id: '', descricao: 'Não informada' };

        return {
          ...nota,
          autor,
          aprovador,
          supervisao_tecnica,
          area_coordenacao: { id: '', descricao: supervisao_tecnica.descricao },
          historico_edicoes: processedHistorico
        };
      }) as NotaOficial[];

      if (searchQuery) {
        // Filter by search query
        return processedData.filter(nota => 
          nota.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
          nota.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nota.autor?.nome_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nota.supervisao_tecnica?.descricao.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return processedData;
    }
  });
};
