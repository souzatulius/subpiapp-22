
import { useState, useCallback, useEffect } from 'react';
import { FilterOptions, ChartVisibility } from '@/components/ranking/types';
import { toast } from 'sonner';

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

  // Track if filters have been modified from default
  const [isModified, setIsModified] = useState(false);

  const handleFiltersChange = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      setIsModified(true);
      return updated;
    });
  }, []);

  const handleChartVisibilityChange = useCallback((newVisibility: Partial<ChartVisibility>) => {
    setChartVisibility(prev => ({ ...prev, ...newVisibility }));
  }, []);

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    console.log("Resetting filters to defaults");
    setFilters(defaultFilters);
    setIsModified(false);
    toast.success("Filtros redefinidos para os valores padrão");
  }, []);

  // Debug log effect
  useEffect(() => {
    console.log("Current filters:", filters);
    console.log("Filters modified:", isModified);
  }, [filters, isModified]);

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    resetFilters,
    isModified
  };
};
