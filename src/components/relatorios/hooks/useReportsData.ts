
import { useState, useEffect, useCallback } from 'react';
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
  console.log('useReportsData iniciando com filtros:', filters);
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
  console.log('useReportsData - cardStats:', cardStats);
  console.log('useReportsData - reportsData:', reportsData);
  console.log('useReportsData - isLoadingCards:', isLoadingCards);
  console.log('useReportsData - isLoadingCharts:', isLoadingCharts);

  // Utilizando useCallback para evitar recriação desnecessária da função
  const fetchData = useCallback(async () => {
    console.log('Iniciando carregamento de dados para relatórios com filtros:', filters);
    setIsLoading(true);
    
    try {
      // Primeiro, buscamos os dados dos cards
      console.log('Buscando dados para cards...');
      await fetchCardStats(filters);
      console.log('Dados dos cards carregados com sucesso');
      
      // Em seguida, buscamos os dados para os gráficos
      console.log('Buscando dados para gráficos...');
      await fetchChartData(filters);
      console.log('Dados dos gráficos carregados com sucesso');
      
    } catch (error) {
      console.error('Erro ao buscar dados de relatórios:', error);
    } finally {
      console.log('Finalizando carregamento de dados');
      setIsLoading(false);
    }
  }, [filters, fetchCardStats, fetchChartData]);

  useEffect(() => {
    console.log('useReportsData - useEffect disparado para buscar dados');
    fetchData();
  }, [fetchData]);

  return {
    reportsData,
    isLoading: isLoading || isLoadingCards || isLoadingCharts,
    cardStats
  };
};
