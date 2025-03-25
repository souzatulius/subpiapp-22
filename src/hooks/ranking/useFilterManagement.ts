
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
