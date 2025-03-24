
import { useState } from 'react';
import { FilterOptions } from '../types';

export const useFilterVisibility = (filters: FilterOptions) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (filters.statuses.length > 0 && !filters.statuses.includes('Todos')) count++;
    if (filters.districts.length > 0 && !filters.districts.includes('Todos')) count++;
    if (filters.areas && filters.areas.length === 1 && filters.areas[0] !== 'Todos') count++;
    if (filters.companies && filters.companies.length > 0 && !filters.companies.includes('Todos')) count++;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    
    return count;
  };

  return {
    isOpen,
    toggleFilters,
    getActiveFilterCount
  };
};
