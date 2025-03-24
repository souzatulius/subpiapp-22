
import { useState } from 'react';
import { OS156Item, OS156FilterOptions, OrderStatus, District } from '@/components/ranking/types';

export const useOS156Filters = (osData: OS156Item[], onFilteredDataChange: (data: OS156Item[]) => void) => {
  const [filters, setFilters] = useState<OS156FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos'],
    areaTecnica: 'Todos',
    empresa: ['Todos'],
    dataInicio: undefined,
    dataFim: undefined
  });

  const applyFilters = (newFilters: OS156FilterOptions) => {
    if (osData.length === 0) {
      return;
    }
    
    let filteredData = [...osData];
    
    // Apply status filter
    if (newFilters.statuses && !newFilters.statuses.includes('Todos' as OrderStatus)) {
      filteredData = filteredData.filter(item => 
        newFilters.statuses.includes(item.status as OrderStatus)
      );
    }
    
    // Apply area tecnica filter
    if (newFilters.areaTecnica !== 'Todos') {
      filteredData = filteredData.filter(item => item.area_tecnica === newFilters.areaTecnica);
    }
    
    // Apply company filter
    if (newFilters.empresa && newFilters.empresa.length > 0 && !newFilters.empresa.includes('Todos')) {
      filteredData = filteredData.filter(item => item.empresa && newFilters.empresa.includes(item.empresa));
    }
    
    // Apply date range filter
    if (newFilters.dataInicio) {
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) >= new Date(newFilters.dataInicio!)
      );
    }
    
    if (newFilters.dataFim) {
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) <= new Date(newFilters.dataFim!)
      );
    }
    
    // Apply district filter
    if (newFilters.districts && !newFilters.districts.includes('Todos' as District)) {
      filteredData = filteredData.filter(item => 
        item.distrito && newFilters.districts.includes(item.distrito as District)
      );
    }
    
    // Update the filtered data
    onFilteredDataChange(filteredData);
    
    // Update the filters state
    setFilters(newFilters);
  };

  return {
    filters,
    setFilters,
    applyFilters
  };
};
