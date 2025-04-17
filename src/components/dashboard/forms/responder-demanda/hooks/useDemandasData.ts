
import { useFetchDemandas } from './useFetchDemandas';
import { useFetchAreas } from './useFetchAreas';
import { useDemandasFilters } from './useDemandasFilters';
import { useSelectedDemanda } from './useSelectedDemanda';
import { Demanda } from '../types';

export const useDemandasData = () => {
  const { demandas, filteredDemandas, isLoading, searchTerm, setSearchTerm, setDemandas } = useFetchDemandas();
  const { areas } = useFetchAreas();
  const { 
    filteredDemandas: filteredDemandasWithFilters, 
    setFilteredDemandas,
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
    filteredDemandas: filteredDemandasWithFilters,
    setFilteredDemandas,
    selectedDemanda,
    setSelectedDemanda,
    isLoadingDemandas: isLoading,
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
