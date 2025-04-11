import { useState, useEffect } from 'react';
import { ChartConfig } from '@/types/ranking';
import { ChartVisibility } from '@/components/ranking/types';

export const useRankingCharts = () => {
  // Initialize chart visibility state with the correct structure
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
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
    
    // Keeping other chart visibility flags for backward compatibility
    evolution: false,
    departmentComparison: false,
    topCompanies: false,
    districtDistribution: false,
    servicesByDepartment: false,
    servicesByDistrict: false,
    timeComparison: false,
    dailyDemands: false,
    closureTime: false,
    neighborhoodComparison: false,
    efficiencyImpact: false,
    criticalStatus: false,
    serviceDiversity: false,
    externalDistricts: false,
  });

  // Mock charts data for potential future use
  const [charts] = useState<ChartConfig[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentTab, setCurrentTab] = useState('performance');
  const [planilhaData, setPlanilhaData] = useState<any[]>([]);
  const [painelData, setPainelData] = useState<any[]>([]);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);
  const [sgzData, setSgzData] = useState<any[] | null>([]);

  // Toggle chart visibility
  const toggleChartVisibility = (chartId: string) => {
    setChartVisibility(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }));
  };

  // Mock data refresh function
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Initialize mock data
  useEffect(() => {
    // Only set mock data if we don't already have data
    if (planilhaData.length === 0) {
      setPlanilhaData([{ id: 1, name: 'Mock Data' }]);
    }
    if (painelData.length === 0) {
      setPainelData([{ id: 1, name: 'Painel Data' }]);
    }
    if (!sgzData || sgzData.length === 0) {
      setSgzData([{ id: 1, name: 'SGZ Data' }]);
    }
    if (!uploadId) {
      setUploadId('mock-upload-id');
    }
  }, [planilhaData.length, painelData.length, sgzData, uploadId]);

  return {
    charts,
    isLoading,
    refreshData,
    chartVisibility,
    toggleChartVisibility,
    setChartVisibility,
    lastUpdated,
    currentTab,
    setCurrentTab,
    planilhaData,
    setPlanilhaData,
    painelData,
    setPainelData,
    sgzData,
    setSgzData,
    uploadId,
    setUploadId
  };
};
