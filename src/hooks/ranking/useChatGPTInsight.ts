
import { useState, useEffect } from 'react';
import { useRankingCharts } from './useRankingCharts';
import { InsightResult } from '@/types/insights';

export interface ChatGPTInsightResult {
  generateInsights: (data: any[]) => Promise<InsightResult>;
  isLoading: boolean;
  results: InsightResult;
  progress: number;
}

export const useChatGPTInsight = (data: any[] | null, uploadId?: string): ChatGPTInsightResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<InsightResult>({});
  const [progress, setProgress] = useState<number>(0);
  const { setInsightsProgress, insightsProgress } = useRankingCharts();

  useEffect(() => {
    if (data && data.length > 0) {
      generateInsights(data);
    }
  }, [data, uploadId]);

  const generateInsights = async (dataInput: any[]): Promise<InsightResult> => {
    try {
      setIsLoading(true);
      setProgress(10);
      if (setInsightsProgress) {
        setInsightsProgress(10);
      }

      // Process the data to generate insights
      // This is a simple example - in a real app, this would involve more complex calculations
      const total = dataInput.length;

      // Count by status
      const statusCounts: Record<string, number> = {};
      dataInput.forEach(item => {
        const status = (item.sgz_status || item.status || '').toUpperCase();
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      // Calculate percentages
      const fechadas = statusCounts['CONCLUÍDA'] || statusCounts['CONCLUIDO'] || 0;
      const pendentes = statusCounts['EM ABERTO'] || statusCounts['PENDENTE'] || statusCounts['EM ANDAMENTO'] || 0;
      const canceladas = statusCounts['CANCELADA'] || 0;

      // Calculate percentages
      const percentFechadas = total > 0 ? ((fechadas / total) * 100).toFixed(1) : '0';
      const percentPendentes = total > 0 ? ((pendentes / total) * 100).toFixed(1) : '0';
      const percentCanceladas = total > 0 ? ((canceladas / total) * 100).toFixed(1) : '0';

      // Calculate average resolution time
      let prazoMedio = '0';
      const resolutionTimes: number[] = [];
      
      dataInput.forEach(item => {
        const dataCriacao = item.sgz_criado_em || item.data_abertura;
        const dataFechamento = item.sgz_modificado_em || item.data_fechamento;
        
        if (dataCriacao && dataFechamento) {
          const start = new Date(dataCriacao);
          const end = new Date(dataFechamento);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          resolutionTimes.push(diffDays);
        }
      });

      if (resolutionTimes.length > 0) {
        const avgTime = resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length;
        prazoMedio = avgTime.toFixed(1);
      }

      // Calculate orders out of deadline
      const foraDoPrazo = dataInput.filter(item => {
        const status = (item.sgz_status || item.status || '').toUpperCase();
        const diasAteStatus = item.sgz_dias_ate_status_atual || 0;
        return status !== 'CONCLUÍDA' && status !== 'CONCLUIDO' && diasAteStatus > 30;
      }).length;

      setProgress(90);
      if (setInsightsProgress) {
        setInsightsProgress(90);
      }

      // Create insights object
      const insights: InsightResult = {
        fechadas: {
          valor: `${percentFechadas}%`,
          comentario: 'Finalizadas oficialmente',
          trend: Number(percentFechadas) > 50 ? 'up' : 'down'
        },
        pendentes: {
          valor: `${percentPendentes}%`,
          comentario: 'Aguardando solução',
          trend: Number(percentPendentes) > 30 ? 'down' : 'neutral'
        },
        canceladas: {
          valor: `${percentCanceladas}%`,
          comentario: 'Encerradas sem execução',
          trend: Number(percentCanceladas) > 10 ? 'down' : 'neutral'
        },
        prazo_medio: {
          valor: `${prazoMedio} dias`,
          comentario: 'Tempo médio até execução',
          trend: Number(prazoMedio) < 15 ? 'up' : 'down'
        },
        fora_do_prazo: {
          valor: `${foraDoPrazo}`,
          comentario: 'Ultrapassaram período',
          trend: foraDoPrazo > 50 ? 'down' : 'up'
        }
      };

      setResults(insights);
      setIsLoading(false);
      setProgress(100);
      if (setInsightsProgress) {
        setInsightsProgress(100);
      }
      
      return insights;
    } catch (error) {
      console.error("Error generating insights:", error);
      setIsLoading(false);
      setProgress(0);
      if (setInsightsProgress) {
        setInsightsProgress(0);
      }
      return {};
    }
  };

  return {
    generateInsights,
    isLoading,
    results,
    progress
  };
};
