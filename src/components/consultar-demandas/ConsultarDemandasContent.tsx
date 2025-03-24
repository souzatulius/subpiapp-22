
import React, { useEffect } from 'react';
import { useDemandasData } from '@/hooks/consultar-demandas/useDemandasData';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import DemandasTable from './DemandasTable';
import DemandasSearchBar from './DemandasSearchBar';
import { Demand } from '@/hooks/consultar-demandas/types';
import DemandDetail from './DemandDetail';
import DeleteDemandDialog from './DeleteDemandDialog';
import { useQueryParams } from '@/hooks/useQueryParams';

const ConsultarDemandasContent: React.FC = () => {
  const {
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
  } = useDemandasData();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useQueryParams();

  // Check if a specific demand was requested via URL parameter
  useEffect(() => {
    const demandId = queryParams.get('id');
    if (demandId && filteredDemandas.length > 0) {
      const demand = filteredDemandas.find(d => d.id === demandId);
      if (demand) {
        setSelectedDemand(demand);
        setIsDetailOpen(true);
      }
    }
  }, [queryParams, filteredDemandas, setSelectedDemand, setIsDetailOpen]);

  // Update URL when demand is selected
  useEffect(() => {
    if (selectedDemand && isDetailOpen) {
      // Add demand ID to URL without reloading page
      const url = new URL(window.location.href);
      url.searchParams.set('id', selectedDemand.id);
      navigate(`${location.pathname}?id=${selectedDemand.id}`, { replace: true });
    } else {
      // Remove demand ID from URL
      navigate(location.pathname, { replace: true });
    }
  }, [selectedDemand, isDetailOpen, navigate, location.pathname]);

  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleEdit = (demand: Demand) => {
    // Placeholder for edit functionality
    console.log('Edit demand:', demand.id);
  };

  const handleRespondDemand = (demand: Demand) => {
    // Placeholder for respond functionality
    console.log('Respond to demand:', demand.id);
  };

  const handleDeleteClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Erro ao carregar demandas: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DemandasSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <DemandasTable 
        demandas={filteredDemandas}
        isLoading={isLoading}
        onViewDemand={handleViewDemand}
        onRespondDemand={handleRespondDemand}
        onDeleteClick={handleDeleteClick}
      />

      {selectedDemand && (
        <DemandDetail 
          demand={selectedDemand} 
          isOpen={isDetailOpen} 
          onClose={() => setIsDetailOpen(false)}
          onEdit={() => handleEdit(selectedDemand)}
        />
      )}

      <DeleteDemandDialog
        isOpen={isDeleteDialogOpen}
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default ConsultarDemandasContent;
