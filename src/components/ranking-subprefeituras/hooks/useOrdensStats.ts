
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { OrdensStats, OrdemServico } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for calculating statistics based on orders data
 */
export const useOrdensStats = (ordens: OrdemServico[]) => {
  const [stats, setStats] = useState<OrdensStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const calculateStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // If we have the data in props, use it directly instead of fetching again
      let allOrdens = ordens;
      
      // If ordens is empty, fetch them from the database
      if (allOrdens.length === 0) {
        const { data, error } = await supabase
          .from('ordens_servico')
          .select('*');
          
        if (error) {
          console.error('Erro ao buscar todas as ordens:', error);
          toast({
            title: "Erro ao buscar todas as ordens!",
            description: "Ocorreu um problema ao carregar os dados.",
            variant: "destructive",
          });
          return;
        }
        
        allOrdens = data as OrdemServico[];
      }

      const totalOrdens = allOrdens.length;

      // Calcula o tempo médio de resolução
      const ordensResolvidas = allOrdens.filter(ordem => ordem.dias !== null);
      const tempoTotalResolucao = ordensResolvidas.reduce((acc, ordem) => acc + (ordem.dias || 0), 0);
      const tempoMedioResolucao = ordensResolvidas.length > 0 ? tempoTotalResolucao / ordensResolvidas.length : 0;

      // Calcula o total por distrito
      const totalPorDistrito: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const distrito = ordem.distrito || 'Desconhecido';
        acc[distrito] = (acc[distrito] || 0) + 1;
        return acc;
      }, {});

      // Calcula o total por classificação
      const totalPorClassificacao: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const classificacao = ordem.classificacao || 'Não Classificado';
        acc[classificacao] = (acc[classificacao] || 0) + 1;
        return acc;
      }, {});

      // Calcula o total por status
      const totalPorStatus: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const status = ordem.status || 'Sem Status';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calcula o total por bairro
      const totalPorBairro: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const bairro = ordem.bairro || 'Não Informado';
        acc[bairro] = (acc[bairro] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalOrdens,
        tempoMedioResolucao,
        totalPorDistrito,
        totalPorClassificacao,
        totalPorStatus,
        totalPorBairro,
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      toast({
        title: "Erro ao calcular estatísticas!",
        description: "Ocorreu um problema ao calcular as estatísticas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [ordens, toast]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return {
    stats,
    loading,
    calculateStats
  };
};
