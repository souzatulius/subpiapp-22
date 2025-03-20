
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useNotasData = () => {
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    fetchNotas();
  }, [statusFilter]);

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

      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
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

  // Apply search filter to notes
  const filteredNotas = notas.filter(nota => {
    if (!searchQuery.trim()) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      nota.titulo?.toLowerCase().includes(searchLower) ||
      nota.texto?.toLowerCase().includes(searchLower) ||
      nota.autor?.nome_completo?.toLowerCase().includes(searchLower) ||
      nota.area_coordenacao?.descricao?.toLowerCase().includes(searchLower) ||
      nota.status?.toLowerCase().includes(searchLower)
    );
  });

  return {
    notas: filteredNotas,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    formatDate,
    refetch: fetchNotas
  };
};
