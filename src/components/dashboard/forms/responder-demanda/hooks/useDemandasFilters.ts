
import { useState, useEffect } from 'react';
import { Demanda } from '../types';

export const useDemandasFilters = (demandas: Demanda[]) => {
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>("todos");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("todos");

  // Filter demandas based on search, area, and prioridade
  useEffect(() => {
    if (!demandas) return;
    
    let filtered = [...demandas];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(demanda => 
        demanda.titulo.toLowerCase().includes(searchLower) ||
        (demanda.detalhes_solicitacao && demanda.detalhes_solicitacao.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply area filter
    if (areaFilter && areaFilter !== "todos") {
      filtered = filtered.filter(demanda => 
        demanda.supervisao_tecnica_id === areaFilter
      );
    }
    
    // Apply prioridade filter
    if (prioridadeFilter && prioridadeFilter !== "todos") {
      filtered = filtered.filter(demanda => 
        demanda.prioridade === prioridadeFilter
      );
    }
    
    setFilteredDemandas(filtered);
  }, [demandas, searchTerm, areaFilter, prioridadeFilter]);

  return {
    filteredDemandas,
    setFilteredDemandas,
    searchTerm,
    setSearchTerm,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter
  };
};
