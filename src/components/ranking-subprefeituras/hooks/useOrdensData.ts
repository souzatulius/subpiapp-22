
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { OrdemServico, ChartFilters } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for fetching and managing orders data with filtering
 */
export const useOrdensData = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [filters, setFilters] = useState<ChartFilters>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchOrdens = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ordens_servico')
        .select('*')
        .order('criado_em', { ascending: false });

      if (filters.distrito) {
        query = query.eq('distrito', filters.distrito);
      }
      if (filters.bairro) {
        query = query.eq('bairro', filters.bairro);
      }
      if (filters.classificacao) {
        query = query.eq('classificacao', filters.classificacao);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.dataDe) {
        query = query.gte('criado_em', filters.dataDe);
      }
      if (filters.dataAte) {
        query = query.lte('criado_em', filters.dataAte);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar ordens:', error);
        toast({
          title: "Erro ao buscar ordens de serviço!",
          description: "Ocorreu um problema ao carregar os dados.",
          variant: "destructive",
        });
      }

      if (data) {
        setOrdens(data as OrdemServico[]);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchOrdens();
  }, [fetchOrdens]);

  return {
    ordens,
    loading,
    filters,
    setFilters,
    fetchOrdens
  };
};
