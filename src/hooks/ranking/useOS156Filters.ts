
import { useState, useCallback } from 'react';
import { OS156FilterOptions, OS156Item, OrderStatus, District, AreaTecnica } from '@/components/ranking/types';

export const useOS156Filters = (osData: OS156Item[], onFilteredDataChange: (filteredData: OS156Item[]) => void) => {
  const [filters, setFilters] = useState<OS156FilterOptions>({
    statuses: ['Todos'],
    districts: ['Todos'],
    areaTecnica: 'Todos',
    empresa: [],
    dataInicio: null,
    dataFim: null
  });

  // Function to apply filters
  const applyFilters = useCallback((filterOptions: OS156FilterOptions) => {
    let filteredData = [...osData];

    // Filter by status
    if (filterOptions.statuses.length > 0 && !filterOptions.statuses.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filterOptions.statuses.includes(item.status as OrderStatus)
      );
    }

    // Filter by district
    if (filterOptions.districts.length > 0 && !filterOptions.districts.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filterOptions.districts.includes(item.distrito as District)
      );
    }

    // Filter by technical area
    if (filterOptions.areaTecnica !== 'Todos') {
      filteredData = filteredData.filter(item => 
        item.area_tecnica === filterOptions.areaTecnica
      );
    }

    // Filter by company
    if (filterOptions.empresa && filterOptions.empresa.length > 0) {
      filteredData = filteredData.filter(item => 
        filterOptions.empresa.includes(item.empresa)
      );
    }

    // Filter by date range
    if (filterOptions.dataInicio) {
      const startDate = new Date(filterOptions.dataInicio);
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) >= startDate
      );
    }

    if (filterOptions.dataFim) {
      const endDate = new Date(filterOptions.dataFim);
      endDate.setHours(23, 59, 59, 999); // End of day
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) <= endDate
      );
    }

    // Call the callback with filtered data
    onFilteredDataChange(filteredData);
  }, [osData, onFilteredDataChange]);

  return {
    filters,
    setFilters,
    applyFilters
  };
};
