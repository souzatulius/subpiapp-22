
import { useState, useEffect, useCallback } from 'react';
import { ChartVisibility } from '@/components/ranking/types';

export const useRankingCharts = () => {
  // Chart visibility state
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    statusDistribution: true,
    statusTransition: true,
    districtEfficiencyRadar: true,
    resolutionTime: true,
    districtPerformance: true,
    serviceTypes: true,
    responsibility: true,
    sgzPainel: true,
    oldestPendingList: true,
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

  // Data state
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [planilhaData, setPlanilhaData] = useState<any[]>([]);
  const [sgzData, setSgzData] = useState<any[] | null>(null);
  const [painelData, setPainelData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMockData, setIsMockData] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'mock' | 'upload' | 'supabase'>('mock');
  const [isInsightsLoading, setIsInsightsLoading] = useState<boolean>(false);
  
  // Toggle chart visibility function
  const toggleChartVisibility = useCallback((chartId: keyof ChartVisibility) => {
    setChartVisibility(prevState => {
      const newState = { ...prevState };
      newState[chartId] = !newState[chartId];
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('chart-visibility', JSON.stringify(newState));
      } catch (e) {
        console.warn('Failed to save chart visibility to localStorage:', e);
      }
      
      return newState;
    });
  }, []);
  
  // Refresh chart data
  const refreshChartData = useCallback(async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    
    try {
      // Check localStorage for saved data
      const savedSource = localStorage.getItem('demo-data-source') || 'mock';
      
      if (savedSource === 'upload') {
        console.log('Loading data from localStorage...');
        
        try {
          // Try to load SGZ data
          const sgzDataString = localStorage.getItem('demo-sgz-data');
          if (sgzDataString) {
            const parsedSgzData = JSON.parse(sgzDataString);
            setSgzData(parsedSgzData);
            setPlanilhaData(parsedSgzData);
            console.log(`Loaded ${parsedSgzData.length} SGZ records from localStorage`);
          }
          
          // Try to load Painel data
          const painelDataString = localStorage.getItem('demo-painel-data');
          if (painelDataString) {
            const parsedPainelData = JSON.parse(painelDataString);
            setPainelData(parsedPainelData);
            console.log(`Loaded ${parsedPainelData.length} Painel records from localStorage`);
          }
          
          setDataSource('upload');
          setIsMockData(false);
        } catch (e) {
          console.error('Failed to load data from localStorage:', e);
          setDataSource('mock');
          setIsMockData(true);
        }
      } else {
        // Default to mock data
        console.log('Using mock data...');
        setDataSource('mock');
        setIsMockData(true);
      }
    } catch (e) {
      console.error('Error refreshing chart data:', e);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);
  
  // Load chart visibility and data on component mount
  useEffect(() => {
    const loadChartVisibility = () => {
      try {
        const savedVisibility = localStorage.getItem('chart-visibility');
        if (savedVisibility) {
          setChartVisibility(JSON.parse(savedVisibility));
        }
      } catch (e) {
        console.warn('Failed to load chart visibility from localStorage:', e);
      }
    };
    
    loadChartVisibility();
    refreshChartData();
  }, [refreshChartData]);

  return {
    chartVisibility,
    setChartVisibility,
    toggleChartVisibility,
    uploadId,
    setUploadId,
    planilhaData,
    setPlanilhaData,
    sgzData,
    setSgzData,
    painelData,
    setPainelData,
    isLoading,
    setIsLoading,
    isRefreshing,
    setIsRefreshing,
    isMockData,
    setIsMockData,
    dataSource,
    setDataSource,
    isInsightsLoading,
    setIsInsightsLoading,
    refreshChartData
  };
};
