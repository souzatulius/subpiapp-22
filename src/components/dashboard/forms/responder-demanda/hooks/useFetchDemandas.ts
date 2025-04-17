
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demanda } from '../types';

export const useFetchDemandas = (coordenacaoId?: string) => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);

        // Build query to fetch demands
        const query = supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            horario_publicacao,
            prazo_resposta,
            prioridade,
            coordenacao_id,
            tema:problema_id(
              id,
              descricao,
              coordenacao:coordenacao_id(
                sigla,
                descricao,
                id
              )
            ),
            problema:problema_id(
              id,
              descricao,
              coordenacao:coordenacao_id(
                sigla,
                descricao,
                id
              )
            ),
            coordenacao:coordenacao_id(
              sigla,
              descricao,
              id
            )
          `)
          .eq('status', 'pendente');

        // Apply coordination filter if provided
        if (coordenacaoId) {
          query.eq('coordenacao_id', coordenacaoId);
        }

        // Order by creation date, newest first
        query.order('horario_publicacao', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching demandas:', error);
          throw error;
        }

        // Verify data is an array
        if (!data || !Array.isArray(data)) {
          console.error('Demandas data is not an array:', data);
          throw new Error('Failed to fetch demandas: Invalid data format');
        }

        const formattedDemandas = data.map((demanda): Demanda => ({
          id: demanda.id,
          titulo: demanda.titulo,
          status: demanda.status,
          detalhes_solicitacao: demanda.detalhes_solicitacao,
          horario_publicacao: demanda.horario_publicacao,
          prazo_resposta: demanda.prazo_resposta,
          prioridade: demanda.prioridade,
          coordenacao_id: demanda.coordenacao_id,
          tema: demanda.tema ? {
            id: demanda.tema.id,
            descricao: demanda.tema.descricao,
            coordenacao: demanda.tema.coordenacao
          } : null,
          problema: demanda.problema ? {
            id: demanda.problema.id,
            descricao: demanda.problema.descricao,
            coordenacao: demanda.problema.coordenacao
          } : null,
          coordenacao: demanda.coordenacao || {
            id: undefined,
            descricao: "Não definida",
            sigla: undefined
          },
        }));

        setDemandas(formattedDemandas);
        setFilteredDemandas(formattedDemandas);
      } catch (error) {
        console.error('Failed to fetch demandas:', error);
        toast({
          title: 'Erro ao carregar demandas',
          description: 'Não foi possível carregar a lista de demandas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, [coordenacaoId]);

  // Filter demands based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(
      (demanda) =>
        demanda.titulo.toLowerCase().includes(lowercaseSearchTerm) ||
        demanda.detalhes_solicitacao?.toLowerCase().includes(lowercaseSearchTerm)
    );

    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  return {
    demandas,
    filteredDemandas,
    isLoading,
    searchTerm,
    setSearchTerm,
    setDemandas,  // Expose this for useDemandasData
  };
};
