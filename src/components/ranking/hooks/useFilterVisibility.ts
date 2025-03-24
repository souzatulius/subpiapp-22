
import { useState } from 'react';
import { OS156FilterOptions, OrderStatus, District } from '../types';

export const useFilterVisibility = (filters: OS156FilterOptions) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (!filters.statuses.includes('Todos' as OrderStatus)) count++;
    if (!filters.districts.includes('Todos' as District)) count++;
    if (filters.areaTecnica !== 'Todos') count++;
    if (!filters.empresa.includes('Todos')) count++;
    if (filters.dataInicio) count++;
    if (filters.dataFim) count++;
    
    return count;
  };

  return {
    isOpen,
    toggleFilters,
    getActiveFilterCount
  };
};
