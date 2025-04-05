
import { useState, useEffect, useCallback } from 'react';
import { useCardStatsData } from './reports/useCardStatsData';
import useChartStatsData from './reports/useChartStatsData';
import { CardStats } from './reports/types';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

export interface ReportFilters {
  dateRange?: DateRange;
  coordenacao?: string;
  problema?: string;
}

export const useReportsData = (initialFilters: ReportFilters = {}) => {
  console.log('useReportsData iniciando com filtros:', initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  
  // Manter estado dos filtros internamente
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: initialFilters.dateRange || { 
      from: subDays(new Date(), 90),
      to: new Date()
    },
    coordenacao: initialFilters.coordenacao,
    problema: initialFilters.problema
  });
  
  const { 
    cardStats, 
    fetchCardStats,
    isLoadingCards
  } = useCardStatsData();
  
  const {
    reportsData,
    isLoading: isLoadingCharts,
    fetchChartData,
    selectedMonth,
    handleMonthChange
  } = useChartStatsData();

  // Log para debug
  console.log('useReportsData - cardStats:', cardStats);
  console.log('useReportsData - reportsData:', reportsData);
  console.log('useReportsData - isLoadingCards:', isLoadingCards);
  console.log('useReportsData - isLoadingCharts:', isLoadingCharts);
  console.log('useReportsData - filtros atuais:', filters);

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
      await fetchChartData();
      console.log('Dados dos gráficos carregados com sucesso');
      
    } catch (error) {
      console.error('Erro ao buscar dados de relatórios:', error);
    } finally {
      console.log('Finalizando carregamento de dados');
      setIsLoading(false);
    }
  }, [filters, fetchCardStats, fetchChartData]);

  // Resetar filtros para o estado inicial
  const resetFilters = useCallback(() => {
    const defaultFilters: ReportFilters = {
      dateRange: { 
        from: subDays(new Date(), 90),
        to: new Date() 
      }
    };
    
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    console.log('useReportsData - useEffect disparado para buscar dados');
    fetchData();
    
    // Para desenvolvimento, podemos adicionar um refresh automático dos dados a cada 2 minutos
    const intervalId = setInterval(() => {
      console.log('Atualizando dados automaticamente...');
      fetchData();
    }, 120000); // 2 minutos
    
    return () => {
      clearInterval(intervalId);
      console.log('useReportsData - limpeza do intervalo de atualização');
    };
  }, [fetchData]);

  return {
    reportsData,
    isLoading: isLoading || isLoadingCards || isLoadingCharts,
    cardStats,
    filters,
    setFilters,
    resetFilters,
    selectedMonth,
    handleMonthChange
  };
};
