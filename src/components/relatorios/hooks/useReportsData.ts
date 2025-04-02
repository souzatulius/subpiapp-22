
import { useState, useEffect } from 'react';
import { useCardStatsData } from './reports/useCardStatsData';
import { useChartStatsData } from './reports/useChartStatsData';
import { CardStats } from './reports/types';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';

export interface ReportFilters {
  dateRange?: DateRange;
  coordenacao?: string;
  problema?: string;
}

export const useReportsData = (filters: ReportFilters = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    cardStats, 
    fetchCardStats,
    isLoadingCards
  } = useCardStatsData();
  
  const {
    reportsData,
    fetchChartData,
    isLoadingCharts
  } = useChartStatsData();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Primeiro, buscamos os dados dos cards
        await fetchCardStats(filters);
        
        // Em seguida, buscamos os dados para os gráficos
        await fetchChartData(filters);
        
      } catch (error) {
        console.error('Erro ao buscar dados de relatórios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, fetchCardStats, fetchChartData]);

  return {
    reportsData,
    isLoading: isLoading || isLoadingCards || isLoadingCharts,
    cardStats
  };
};
