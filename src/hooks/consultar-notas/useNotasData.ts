
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { startOfDay, endOfDay, isAfter, isBefore, isEqual } from 'date-fns';

export const useNotasData = () => {
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dataInicioFilter, setDataInicioFilter] = useState<Date | undefined>(undefined);
  const [dataFimFilter, setDataFimFilter] = useState<Date | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchNotas();
  }, [statusFilter, areaFilter, dataInicioFilter, dataFimFilter]);

  const fetchNotas = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id(id, nome_completo),
          aprovador:aprovador_id(id, nome_completo),
          area_coordenacao:area_coordenacao_id(id, descricao)
        `)
        .order('criado_em', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (areaFilter !== 'all') {
        query = query.eq('area_coordenacao_id', areaFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to handle null values
      const transformedData = data?.map(nota => ({
        ...nota,
        autor: nota.autor || { nome_completo: 'Não informado' },
        area_coordenacao: nota.area_coordenacao || { descricao: 'Não informada' }
      })) || [];

      setNotas(transformedData);
    } catch (error: any) {
      console.error('Erro ao carregar notas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNota = async (notaId: string) => {
    setDeleteLoading(true);
    try {
      // First check if this nota has a related demanda
      const { data: nota, error: notaError } = await supabase
        .from('notas_oficiais')
        .select('demanda_id')
        .eq('id', notaId)
        .single();

      if (notaError) throw notaError;

      // If there's a related demanda, update its status instead of deleting it
      if (nota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ 
            status: 'aguardando_nota' // Set status to indicate it needs a note again
          })
          .eq('id', nota.demanda_id);

        if (demandaError) throw demandaError;
      }

      // Now delete the nota
      const { error } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', notaId);

      if (error) throw error;

      // Update the local state
      setNotas(notas.filter(n => n.id !== notaId));

      toast({
        title: 'Nota excluída',
        description: 'A nota foi excluída com sucesso.',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a nota',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Data não informada';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Apply all filters to notes
  const filteredNotas = notas.filter(nota => {
    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      if (!(
        nota.titulo?.toLowerCase().includes(searchLower) ||
        nota.texto?.toLowerCase().includes(searchLower) ||
        nota.autor?.nome_completo?.toLowerCase().includes(searchLower) ||
        nota.area_coordenacao?.descricao?.toLowerCase().includes(searchLower) ||
        nota.status?.toLowerCase().includes(searchLower)
      )) {
        return false;
      }
    }

    // Apply date filters
    if (dataInicioFilter) {
      const notaDate = new Date(nota.criado_em);
      const startDate = startOfDay(dataInicioFilter);
      if (isBefore(notaDate, startDate) && !isEqual(notaDate, startDate)) {
        return false;
      }
    }

    if (dataFimFilter) {
      const notaDate = new Date(nota.criado_em);
      const endDate = endOfDay(dataFimFilter);
      if (isAfter(notaDate, endDate) && !isEqual(notaDate, endDate)) {
        return false;
      }
    }

    return true;
  });

  return {
    notas,
    filteredNotas,
    loading,
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
    refetch: fetchNotas,
    deleteNota,
    deleteLoading
  };
};
