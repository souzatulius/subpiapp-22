
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

  // Log para debug
  console.log('useReportsData - filters:', filters);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Iniciando carregamento de dados para relatórios...');
        
        // Primeiro, buscamos os dados dos cards
        await fetchCardStats(filters);
        console.log('Dados dos cards carregados com sucesso');
        
        // Em seguida, buscamos os dados para os gráficos
        await fetchChartData(filters);
        console.log('Dados dos gráficos carregados com sucesso');
        
      } catch (error) {
        console.error('Erro ao buscar dados de relatórios:', error);
      } finally {
        setIsLoading(false);
        console.log('Carregamento de dados concluído');
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
