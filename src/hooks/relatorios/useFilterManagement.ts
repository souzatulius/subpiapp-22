
import { useState } from 'react';
import { FilterOptions, ChartVisibility } from '@/components/relatorios/types';

export const useFilterManagement = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos'],
    origins: ['Todos'],
    mediaTypes: ['Todos'],
    coordinationAreas: ['Todos']
  });

  // State for chart visibility
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    districtDistribution: true,
    neighborhoodDistribution: true,
    demandOrigin: true,
    mediaTypes: true,
    responseTime: true,
    serviceTypes: true,
    coordinationAreas: true,
    statusDistribution: true,
    responsibleUsers: true,
    noteApprovals: true
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
