
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demand, Note } from '@/types/demand';

export const useDemandas = (filterStatus?: string) => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchDemandas = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      let query = supabase
        .from('demandas')
        .select(`
          id,
          titulo,
          status,
          prioridade,
          origem_id,
          origem:origens_demandas(descricao),
          horario_publicacao,
          problema:problemas(descricao, coordenacao:coordenacoes(sigla)),
          notas:notas_oficiais(id, titulo, conteudo, status, data_criacao, autor_id)
        `);

      if (filterStatus && filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query.order('horario_publicacao', { ascending: false });

      if (error) throw new Error(error.message);
      
      if (!data) {
        setDemandas([]);
        return;
      }

      // Transform the data to match the Demand type
      const formattedDemandas: Demand[] = data.map(demand => {
        // Format notes to ensure they match the Note interface
        const formattedNotas: Note[] = demand.notas ? demand.notas.map((nota: any) => ({
          id: nota.id,
          titulo: nota.titulo,
          conteudo: nota.conteudo || '',
          status: nota.status || 'pendente',
          data_criacao: nota.data_criacao || new Date().toISOString(),
          autor_id: nota.autor_id || '',
          demanda_id: demand.id
        })) : [];

        return {
          ...demand,
          title: demand.titulo,
          origem: typeof demand.origem === 'object' ? demand.origem?.descricao : demand.origem_id,
          notas: formattedNotas
        };
      });

      setDemandas(formattedDemandas);
      console.log('Formatted demandas:', formattedDemandas);
    } catch (err) {
      console.error('Error fetching demandas:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch demandas'));
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchDemandas();
  }, [fetchDemandas]);

  const handleSelectDemand = useCallback((demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    // We don't clear the selected demand immediately to allow for exit animations
    setTimeout(() => {
      setSelectedDemand(null);
    }, 300);
  }, []);

  return {
    demandas,
    isLoading,
    error,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail,
    refetch: fetchDemandas
  };
};
