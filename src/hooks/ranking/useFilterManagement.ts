
import { useState, useCallback } from 'react';
import { FilterOptions, ChartVisibility } from '@/components/ranking/types';

export const useFilterManagement = () => {
  // Default filter state
  const defaultFilters: FilterOptions = {
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos']
  };

  // Default visibility state
  const defaultChartVisibility: ChartVisibility = {
    statusDistribution: true,
    resolutionTime: true,
    topCompanies: true,
    districtDistribution: true,
    servicesByDepartment: true,
    servicesByDistrict: true,
    timeComparison: true,
    efficiencyImpact: true,
    dailyDemands: true,
    neighborhoodComparison: true,
    districtEfficiencyRadar: true,
    statusTransition: true,
    criticalStatus: true,
    externalDistricts: true,
    serviceDiversity: true,
    closureTime: true
  };

  // State for filters
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // State for chart visibility
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>(defaultChartVisibility);

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleChartVisibilityChange = (newVisibility: Partial<ChartVisibility>) => {
    setChartVisibility(prev => ({ ...prev, ...newVisibility }));
  };

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    resetFilters
  };
};
