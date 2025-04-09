
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';
import { useDemandasQuery } from './useDemandasQuery';
import { useDemandasActions } from './useDemandasActions';
import { DateRange } from 'react-day-picker';

interface FilterParams {
  searchTerm?: string;
  dateRange?: DateRange;
  coordenacao?: string;
  tema?: string;
  status?: string;
  prioridade?: string;
}

export const useDemandasData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterParams>({});
  
  const {
    data: demandas = [],
    isLoading,
    error,
    refetch,
  } = useDemandasQuery();
  
  const {
    selectedDemand,
    setSelectedDemand,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    handleDeleteConfirm
  } = useDemandasActions(refetch);

  // Filter demandas based on all filters
  const applyFilters = useCallback((filters: FilterParams) => {
    setActiveFilters(filters);
    
    const { searchTerm, dateRange, coordenacao, tema, status, prioridade } = filters;
    
    let filtered = [...demandas];
    
    // Apply text search filter
    if (searchTerm?.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      filtered = filtered.filter(demanda => {
        const matchTitle = demanda.titulo?.toLowerCase().includes(lowerSearchTerm);
        const matchArea = demanda.area_coordenacao?.descricao?.toLowerCase().includes(lowerSearchTerm);
        const matchCoord = demanda.problema?.coordenacao?.descricao?.toLowerCase().includes(lowerSearchTerm);
        const matchProblem = demanda.problema?.descricao?.toLowerCase().includes(lowerSearchTerm);
        
        return matchTitle || matchArea || matchProblem || matchCoord;
      });
    }
    
    // Apply date range filter
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(demanda => {
        const demandaDate = demanda.horario_publicacao ? new Date(demanda.horario_publicacao) : null;
        if (!demandaDate) return false;
        
        // If only 'from' date is set
        if (!dateRange.to) {
          return demandaDate >= fromDate;
        }
        
        // If both 'from' and 'to' dates are set
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        
        return demandaDate >= fromDate && demandaDate <= toDate;
      });
    }
    
    // Apply coordenacao filter
    if (coordenacao && coordenacao !== 'todos') {
      filtered = filtered.filter(demanda => {
        const problemCoordId = demanda.problema?.coordenacao?.id;
        const areaCoordId = demanda.area_coordenacao?.id;
        
        return problemCoordId === coordenacao || areaCoordId === coordenacao;
      });
    }
    
    // Apply tema filter
    if (tema && tema !== 'todos') {
      filtered = filtered.filter(demanda => demanda.problema_id === tema);
    }
    
    // Apply status filter
    if (status && status !== 'todos') {
      filtered = filtered.filter(demanda => demanda.status === status);
    }
    
    // Apply prioridade filter
    if (prioridade && prioridade !== 'todas') {
      filtered = filtered.filter(demanda => demanda.prioridade === prioridade);
    }
    
    setFilteredDemandas(filtered);
  }, [demandas]);

  // Update filtered demandas when search term changes or demandas are loaded
  useEffect(() => {
    applyFilters({ searchTerm });
  }, [searchTerm, demandas, applyFilters]);

  return {
    searchTerm,
    setSearchTerm,
    selectedDemand,
    setSelectedDemand,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    filteredDemandas,
    isLoading,
    error,
    refetch,
    handleDeleteConfirm,
    applyFilters
  };
};
