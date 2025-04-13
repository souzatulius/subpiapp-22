
import { useState, useEffect, useCallback } from 'react';

export const useRankingCharts = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [insightsProgress, setInsightsProgress] = useState(0);
  const [chartsProgress, setChartsProgress] = useState(0);
  const [isChartsLoading, setIsChartsLoading] = useState(false);
  
  // Load chart data on mount
  useEffect(() => {
    refreshChartData();
  }, []);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setFilteredData(data);
  }, [data]);
  
  // Refresh chart data
  const refreshChartData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demonstration, we're loading mock data
      const response = await fetch('/mock/zeladoria_mock_data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      
      setData(jsonData);
      setFilteredData(jsonData);
      console.info('Using mock data...');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading chart data'));
      console.error('Error loading chart data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters to the data
  const applyFilters = useCallback((filters: any) => {
    let result = [...data];
    
    // Apply actual filtering logic based on provided filters
    if (filters.subprefeitura && filters.subprefeitura !== 'all') {
      result = result.filter(item => item.subprefeitura === filters.subprefeitura);
    }
    
    if (filters.month && filters.month !== 'all') {
      result = result.filter(item => {
        const date = new Date(item.data);
        return date.getMonth() + 1 === parseInt(filters.month);
      });
    }
    
    if (filters.year && filters.year !== 'all') {
      result = result.filter(item => {
        const date = new Date(item.data);
        return date.getFullYear() === parseInt(filters.year);
      });
    }
    
    setFilteredData(result);
  }, [data]);

  return {
    data,
    filteredData,
    isLoading,
    error,
    refreshChartData,
    applyFilters,
    resetFilters,
    setIsLoading,
    insightsProgress,
    setInsightsProgress,
    chartsProgress,
    setChartsProgress,
    isChartsLoading,
    setIsChartsLoading
  };
};
