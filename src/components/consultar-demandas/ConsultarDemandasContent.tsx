import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemandasTable from './DemandasTable';
import DemandasSearchBar from './DemandasSearchBar';
import LoadingState from './LoadingState';
import DeleteDemandDialog from './DeleteDemandDialog';
import { useDemandasData, useDemandasActions } from '@/hooks/consultar-demandas';
import { Demand } from '@/types/demand';
import { usePermissions } from '@/hooks/permissions';

const ConsultarDemandasContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isAdmin } = usePermissions();

  const {
    data: demandas,
    isLoading,
    error,
    totalCount,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch,
  } = useDemandasData({ searchTerm });

  const { deleteDemanda } = useDemandasActions();

  useEffect(() => {
    refetch();
  }, [searchTerm, refetch]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/comunicacao/responder?id=${id}`);
  };

  const handleDelete = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDemand) {
      await deleteDemanda(selectedDemand.id);
      setIsDeleteModalOpen(false);
      setSelectedDemand(null);
      refetch();
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedDemand(null);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Consultar Demandas</h1>
      <DemandasSearchBar onSearch={handleSearch} />
      <DemandasTable
        demandas={demandas || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        totalCount={totalCount || 0}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        isAdmin={isAdmin}
      />
      {selectedDemand && (
        <DeleteDemandDialog
          isOpen={isDeleteModalOpen}
          demand={selectedDemand}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ConsultarDemandasContent;
