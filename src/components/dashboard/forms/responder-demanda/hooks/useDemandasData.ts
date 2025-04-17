
import { useState } from 'react';
import { useFetchDemandas } from './useFetchDemandas';
import { useFetchAreas } from './useFetchAreas';
import { useDemandasFilters } from './useDemandasFilters';
import { useSelectedDemanda } from './useSelectedDemanda';
import { Demanda } from '../types';

export const useDemandasData = () => {
  const { 
    demandas, 
    setDemandas, 
    isLoading: isLoadingDemandas,
    filteredDemandas: fetchedFilteredDemandas,
    setFilteredDemandas: setFetchedFilteredDemandas
  } = useFetchDemandas();

  const { areas } = useFetchAreas();
  
  const { 
    filteredDemandas, 
    setFilteredDemandas,
    searchTerm,
    setSearchTerm,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter
  } = useDemandasFilters(demandas);
  
  const { 
    selectedDemanda, 
    setSelectedDemanda, 
    handleSelectDemanda 
  } = useSelectedDemanda();

  return {
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas,
    selectedDemanda,
    setSelectedDemanda,
    isLoadingDemandas,
    areas,
    searchTerm,
    setSearchTerm,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter,
    handleSelectDemanda
  };
};
