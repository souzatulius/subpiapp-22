
import { useState } from 'react';
import { ChartVisibility, FilterOptions } from '@/components/ranking/types';

export const useFilterManagement = () => {
  // Initialize filters with default values
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { from: null, to: null },
    status: [],
    serviceTypes: [],
    distritos: [],
    dataInicio: undefined,
    dataFim: undefined,
    tiposServico: [],
    departamento: []
  });

  // Initialize chart visibility with all charts visible by default
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

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleChartVisibilityChange = (chartId: keyof ChartVisibility, isVisible: boolean) => {
    setChartVisibility({
      ...chartVisibility,
      [chartId]: isVisible
    });
  };

  const resetFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      status: [],
      serviceTypes: [],
      distritos: [],
      dataInicio: undefined,
      dataFim: undefined,
      tiposServico: [],
      departamento: []
    });
  };

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    resetFilters
  };
};
