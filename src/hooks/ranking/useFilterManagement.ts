
import { useState } from 'react';
import { ChartVisibility, FilterOptions } from '@/components/ranking/types';
import { subDays } from 'date-fns';

export const useFilterManagement = () => {
  // Estado para visibilidade de gráficos
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    districtPerformance: true,
    serviceTypes: true,
    resolutionTime: true,
    responsibility: true,
    evolution: true,
    departmentComparison: true,
    oldestPendingList: true,
  });

  // Estado para filtros
  const [filters, setFilters] = useState<FilterOptions>({
    dataInicio: new Date(subDays(new Date(), 30)).toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0],
    status: [],
    distritos: [],
    tiposServico: [],
    departamento: [],
  });

  // Manipular alterações de filtros
  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  // Manipular alterações de visibilidade de gráficos
  const handleChartVisibilityChange = (chartName: keyof ChartVisibility, isVisible: boolean) => {
    setChartVisibility((prev) => ({
      ...prev,
      [chartName]: isVisible,
    }));
  };

  // Resetar filtros
  const resetFilters = () => {
    setFilters({
      dataInicio: new Date(subDays(new Date(), 30)).toISOString().split('T')[0],
      dataFim: new Date().toISOString().split('T')[0],
      status: [],
      distritos: [],
      tiposServico: [],
      departamento: [],
    });
  };

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    resetFilters,
  };
};
