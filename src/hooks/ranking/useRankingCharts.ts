
import { useState, useEffect, useCallback } from 'react';
import { ChartVisibility } from '@/types/ranking';

export const useRankingCharts = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [insightsProgress, setInsightsProgress] = useState(0);
  const [chartsProgress, setChartsProgress] = useState(0);
  const [isChartsLoading, setIsChartsLoading] = useState(false);
  
  // Additional state properties that were missing
  const [sgzData, setSgzData] = useState<any[]>([]);
  const [planilhaData, setPlanilhaData] = useState<any[]>([]);
  const [painelData, setPainelData] = useState<any[]>([]);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'mock' | 'upload' | 'supabase'>('mock');
  
  // Chart visibility state
  const [chartVisibility, setChartVisibilityState] = useState<ChartVisibility>({
    // Performance & Efficiency charts
    statusDistribution: true,
    statusTransition: true,
    districtEfficiencyRadar: true,
    resolutionTime: true,
    
    // Territories & Services charts
    districtPerformance: true,
    serviceTypes: true,
    
    // Critical Flows charts
    responsibility: true,
    sgzPainel: true,
    oldestPendingList: true,
    
    // Additional flags
    evolution: true,
    departmentComparison: true,
    topCompanies: true,
    districtDistribution: true,
    servicesByDepartment: true,
    servicesByDistrict: true,
    timeComparison: true,
    dailyDemands: true,
    closureTime: true,
    neighborhoodComparison: true,
    externalDistricts: true,
    efficiencyImpact: true,
    criticalStatus: true,
    serviceDiversity: true
  });
  
  // Function to toggle chart visibility
  const toggleChartVisibility = useCallback((chartId: keyof ChartVisibility) => {
    setChartVisibilityState(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }));
  }, []);
  
  // Function to set chart visibility
  const setChartVisibility = useCallback((visibility: ChartVisibility) => {
    setChartVisibilityState(visibility);
  }, []);
  
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
    setIsChartsLoading,
    // Add missing properties
    sgzData,
    setSgzData,
    planilhaData,
    setPlanilhaData,
    painelData,
    setPainelData,
    uploadId,
    setUploadId,
    isMockData,
    setIsMockData,
    isRefreshing,
    setIsRefreshing,
    dataSource,
    setDataSource,
    chartVisibility,
    toggleChartVisibility,
    setChartVisibility
  };
};
