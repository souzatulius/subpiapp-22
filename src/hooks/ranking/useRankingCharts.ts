
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
    setChartVisibilityState(prev => {
      const newState = {
        ...prev,
        [chartId]: !prev[chartId]
      };
      // Store visibility state in localStorage for persistence
      localStorage.setItem('chart-visibility', JSON.stringify(newState));
      return newState;
    });
  }, []);
  
  // Function to set chart visibility
  const setChartVisibility = useCallback((visibility: ChartVisibility) => {
    setChartVisibilityState(visibility);
    localStorage.setItem('chart-visibility', JSON.stringify(visibility));
  }, []);
  
  // Load chart data and visibility settings on mount
  useEffect(() => {
    // Try to load chart visibility settings from localStorage
    try {
      const savedVisibility = localStorage.getItem('chart-visibility');
      if (savedVisibility) {
        const parsedVisibility = JSON.parse(savedVisibility);
        setChartVisibilityState(prev => ({
          ...prev,
          ...parsedVisibility
        }));
      }
    } catch (err) {
      console.error('Error loading chart visibility settings:', err);
    }
    
    // Try to load cached data before making a new request
    try {
      const cachedSgzData = localStorage.getItem('demo-sgz-data');
      const cachedPainelData = localStorage.getItem('demo-painel-data');
      
      if (cachedSgzData) {
        const parsedData = JSON.parse(cachedSgzData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setSgzData(parsedData);
          setPlanilhaData(parsedData);
          setIsLoading(false);
          console.log('Loaded cached SGZ data from localStorage:', parsedData.length, 'records');
        }
      }
      
      if (cachedPainelData) {
        const parsedData = JSON.parse(cachedPainelData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setPainelData(parsedData);
          setIsLoading(false);
          console.log('Loaded cached Painel data from localStorage:', parsedData.length, 'records');
        }
      }
    } catch (err) {
      console.error('Error loading cached data:', err);
    }
    
    // Still refresh the data to ensure it's up to date
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
      // Check if we have cached data first
      const cachedSgzData = localStorage.getItem('demo-sgz-data');
      const cachedPainelData = localStorage.getItem('demo-painel-data');
      
      let shouldFetchMock = true;
      
      if (cachedSgzData) {
        try {
          const parsedData = JSON.parse(cachedSgzData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setSgzData(parsedData);
            setPlanilhaData(parsedData);
            shouldFetchMock = false;
          }
        } catch (err) {
          console.error('Error parsing cached SGZ data:', err);
        }
      }
      
      if (cachedPainelData) {
        try {
          const parsedData = JSON.parse(cachedPainelData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setPainelData(parsedData);
            shouldFetchMock = false;
          }
        } catch (err) {
          console.error('Error parsing cached Painel data:', err);
        }
      }
      
      // If no cached data, load mock data
      if (shouldFetchMock) {
        // For demonstration, we're loading mock data
        const response = await fetch('/mock/zeladoria_mock_data.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        setData(jsonData);
        setFilteredData(jsonData);
        setSgzData(jsonData);
        setPlanilhaData(jsonData);
        
        // Store the mock data in localStorage for future use
        localStorage.setItem('demo-sgz-data', JSON.stringify(jsonData));
        localStorage.setItem('demo-data-source', 'mock');
        localStorage.setItem('demo-last-update', new Date().toISOString());
        
        setIsMockData(true);
        setDataSource('mock');
        
        console.info('Using mock data...');
      } else {
        const dataSource = localStorage.getItem('demo-data-source');
        if (dataSource === 'upload' || dataSource === 'supabase') {
          setIsMockData(false);
          setDataSource(dataSource as 'upload' | 'supabase');
        }
      }
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
