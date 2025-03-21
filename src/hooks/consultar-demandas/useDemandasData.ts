
import { useState } from 'react';
import { useDemandasQuery } from './useDemandasQuery';
import { useDemandasActions } from './useDemandasActions';
import { Demand, UseDemandasDataReturn } from './types';

export const useDemandasData = (): UseDemandasDataReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: demandas = [],
    isLoading,
    error,
    refetch
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

  const filteredDemandas = demandas.filter((demand: Demand) => 
    demand.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    demand.servico?.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    demand.area_coordenacao?.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
