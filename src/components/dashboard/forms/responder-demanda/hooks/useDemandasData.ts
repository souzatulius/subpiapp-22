
import { useFetchDemandas } from './useFetchDemandas';
import { useFetchAreas } from './useFetchAreas';
import { useDemandasFilters } from './useDemandasFilters';
import { useSelectedDemanda } from './useSelectedDemanda';

export const useDemandasData = () => {
  const { demandas, setDemandas, isLoadingDemandas } = useFetchDemandas();
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
