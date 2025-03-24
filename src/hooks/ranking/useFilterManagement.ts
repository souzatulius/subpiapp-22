
import { useState } from 'react';
import { FilterOptions, ChartVisibility } from '@/components/ranking/types';

export const useFilterManagement = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos']
  });

  // State for chart visibility with all required properties
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    occurrences: true,
    resolutionTime: true,
    serviceTypes: true,
    neighborhoods: true,
    frequentServices: true,
    statusDistribution: true,
    statusTimeline: true,
    statusTransition: true,
    efficiencyRadar: true,
    criticalStatus: true,
    externalDistricts: true,
    servicesDiversity: true,
    timeToClose: true,
    dailyOrders: true
  });

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleChartVisibilityChange = (newVisibility: Partial<ChartVisibility>) => {
    setChartVisibility(prev => ({ ...prev, ...newVisibility }));
  };

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  };
};
