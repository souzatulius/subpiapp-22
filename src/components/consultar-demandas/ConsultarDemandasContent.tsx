
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandasSearchBar from './DemandasSearchBar';
import DemandasTable from './DemandasTable';
import DeleteDemandDialog from './DeleteDemandDialog';
import DemandDetail from '@/components/demandas/DemandDetail';
import { useDemandasData, type Demand } from '@/hooks/consultar-demandas/useDemandasData';

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
    handleDeleteConfirm
  } = useDemandasData();

  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleRespondDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Demandas</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Lista de Demandas</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <DemandDetail 
        demand={selectedDemand} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />

      <DeleteDemandDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
        demandId={selectedDemand?.id}
      />
    </div>
  );
};

export default ConsultarDemandasContent;
