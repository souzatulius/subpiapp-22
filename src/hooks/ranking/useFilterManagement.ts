
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

  // State for chart visibility
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    occurrences: true,
    resolutionTime: true,
    serviceTypes: true,
    neighborhoods: true,
    frequentServices: true,
    statusDistribution: true,
    topCompanies: true,
    criticalStatus: true
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
