
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';
import { useDemandasQuery } from './useDemandasQuery';
import { useDemandasActions } from './useDemandasActions';

export const useDemandasData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  
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

  // Filter demandas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const filtered = demandas.filter(demanda => {
      const matchTitle = demanda.titulo.toLowerCase().includes(lowerSearchTerm);
      const matchArea = demanda.area_coordenacao?.descricao?.toLowerCase().includes(lowerSearchTerm);
      const matchProblem = demanda.problema?.descricao.toLowerCase().includes(lowerSearchTerm);
      
      return matchTitle || matchArea || matchProblem;
    });
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

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
    handleDeleteConfirm
  };
};
