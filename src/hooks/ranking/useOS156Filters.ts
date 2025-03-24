
import { useState } from 'react';
import { OS156Item, FilterOptions, OrderStatus, District } from '@/components/ranking/types';

export const useOS156Filters = (osData: OS156Item[], onFilteredDataChange: (data: OS156Item[]) => void) => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos' as OrderStatus],
    serviceTypes: ['Todos'],
    districts: ['Todos' as District],
    areas: ['STM', 'STLP'],
    companies: ['Todos']
  });

  const applyFilters = (newFilters: FilterOptions) => {
    if (osData.length === 0) {
      return;
    }
    
    let filteredData = [...osData];
    
    // Apply status filter
    if (newFilters.statuses && !newFilters.statuses.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        newFilters.statuses.includes(item.status as OrderStatus)
      );
    }
    
    // Apply area tecnica filter
    if (newFilters.areas && newFilters.areas.length > 0 && !newFilters.areas.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        newFilters.areas.includes(item.area_tecnica)
      );
    }
    
    // Apply company filter
    if (newFilters.companies && newFilters.companies.length > 0 && !newFilters.companies.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        item.empresa && newFilters.companies.includes(item.empresa)
      );
    }
    
    // Apply date range filter
    if (newFilters.dateRange?.from) {
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) >= new Date(newFilters.dateRange!.from!)
      );
    }
    
    if (newFilters.dateRange?.to) {
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) <= new Date(newFilters.dateRange!.to!)
      );
    }
    
    // Apply district filter
    if (newFilters.districts && !newFilters.districts.includes('Todos')) {
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
