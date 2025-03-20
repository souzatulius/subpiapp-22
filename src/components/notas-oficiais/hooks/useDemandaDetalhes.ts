
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Demanda, NotaOficial } from '../types';

// Define a proper return type for the hook to avoid excessive type instantiation
export interface DetalhesResult {
  demanda: Demanda | null;
  respostas: NotaOficial[];
  notaExistente: boolean;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

/**
 * Hook for fetching and managing demanda details
 */
export const useDemandaDetalhes = (demandaId: string): DetalhesResult => {
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [respostas, setRespostas] = useState<NotaOficial[]>([]);
  const [notaExistente, setNotaExistente] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDemandaDetalhes = useCallback(async () => {
    if (!demandaId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch demanda details
      const { data: demandaData, error: demandaError } = await supabase
        .from('demandas')
        .select(`
          *,
          origem:origem_demanda_id(descricao),
          area:area_coordenacao_id(descricao),
          distrito:distrito_id(nome),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo, email),
          servico:servico_id(descricao)
        `)
        .eq('id', demandaId)
        .single();

      if (demandaError) {
        console.error('Erro ao buscar detalhes da demanda:', demandaError);
        setError('Erro ao buscar detalhes da demanda.');
        toast({
          title: "Erro ao buscar detalhes",
          description: "Não foi possível carregar os detalhes da demanda.",
          variant: "destructive",
        });
        return;
      }

      if (demandaData) {
        // We need to properly type cast the data to match Demanda type
        const formattedDemanda = demandaData as unknown as Demanda;
        setDemanda(formattedDemanda);
      }

      // Fetch notas oficiais relacionadas
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('*')
        .eq('demanda_id', demandaId)
        .order('criado_em', { ascending: false });

      if (notasError) {
        console.error('Erro ao buscar notas oficiais:', notasError);
        setError('Erro ao buscar notas oficiais relacionadas.');
        toast({
          title: "Erro ao buscar notas",
          description: "Não foi possível carregar as notas oficiais relacionadas.",
          variant: "destructive",
        });
        return;
      }

      if (notasData) {
        // We need to properly type cast the data to match NotaOficial type
        const formattedNotas = notasData as unknown as NotaOficial[];
        setRespostas(formattedNotas);
        setNotaExistente(notasData.length > 0);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setError('Ocorreu um erro inesperado.');
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um problema ao carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [demandaId, toast]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    await fetchDemandaDetalhes();
  }, [fetchDemandaDetalhes]);

  // Fetch data on component mount and when demandaId changes
  useEffect(() => {
    fetchDemandaDetalhes();
  }, [fetchDemandaDetalhes]);

  return {
    demanda,
    respostas,
    notaExistente,
    isLoading,
    error,
    refreshData
  };
};
