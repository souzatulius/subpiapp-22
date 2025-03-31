
import { useState, useEffect } from 'react';
import { useCardStatsData } from './reports/useCardStatsData';
import { useChartStatsData } from './reports/useChartStatsData';
import { CardStats } from './reports/types';

export const useReportsData = (filters: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    cardStats, 
    fetchCardStats 
  } = useCardStatsData();
  
  const {
    reportsData,
    fetchChartData
  } = useChartStatsData();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Primeiro, buscamos os dados dos cards
        await fetchCardStats();
        
        // Em seguida, buscamos os dados para os gráficos
        await fetchChartData();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados de relatórios:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, fetchCardStats, fetchChartData]);

  return {
    reportsData,
    isLoading,
    cardStats
  };
};
