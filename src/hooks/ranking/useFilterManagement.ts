import { useState } from 'react';
import { ChartVisibility, FilterOptions } from '@/hooks/dashboard/types';

export const useFilterManagement = () => {
  // Initialize filters with default values
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { from: null, to: null },
    statuses: [],
    serviceTypes: [],
    districts: []
  });

  // Initialize chart visibility with all charts visible by default
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    statusDistribution: true,
    topCompanies: true,
    districtDistribution: true,
    servicesByDepartment: true,
    servicesByDistrict: true,
    timeComparison: true,
    dailyDemands: true,
    statusTransition: true,
    closureTime: true,
    neighborhoodComparison: true,
    districtEfficiencyRadar: true,
    externalDistricts: true,
    efficiencyImpact: true,
    criticalStatus: true,
    serviceDiversity: true,
    // Keep original properties
    districtPerformance: true,
    serviceTypes: true,
    resolutionTime: true,
    responsibility: true,
    evolution: true,
    departmentComparison: true,
    oldestPendingList: true
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
      statuses: [],
      serviceTypes: [],
      districts: []
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
