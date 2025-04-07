
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemandasTable from './DemandasTable';
import DemandasSearchBar from './DemandasSearchBar';
import { LoadingState } from './LoadingState';
import DeleteDemandDialog from './DeleteDemandDialog';
import { useDemandasData } from '@/hooks/consultar-demandas/useDemandasData';
import { usePermissions } from '@/hooks/permissions';
import DemandDetail from '@/components/demandas/DemandDetail';
import { Demand } from '@/hooks/consultar-demandas/types';
import DemandaCards from './DemandaCards';
import FilterBar from './FilterBar';
import { DateRange } from 'react-day-picker';

const ConsultarDemandasContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { isAdmin } = usePermissions();
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  
  // Add filter states
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [coordenacao, setCoordenacao] = useState<string>('todos');
  const [tema, setTema] = useState<string>('todos');
  const [status, setStatus] = useState<string>('todos');

  const {
    filteredDemandas: demandas,
    isLoading,
    error,
    refetch,
    setSearchTerm: updateSearchTerm,
    handleDeleteConfirm,
    selectedDemand: hookSelectedDemand,
    setSelectedDemand: hookSetSelectedDemand,
    applyFilters,
  } = useDemandasData();

  // Add pagination state directly in this component
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalCount = demandas ? demandas.length : 0;

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    applyFilters({
      searchTerm,
      dateRange,
      coordenacao,
      tema,
      status
    });
  }, [searchTerm, dateRange, coordenacao, tema, status, applyFilters]);

  const handleSearch = (term: string) => {
    updateSearchTerm(term);
    setPage(1);
  };

  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDemand(null);
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
      await handleDeleteConfirm();
      setIsDeleteModalOpen(false);
      setSelectedDemand(null);
      refetch();
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedDemand(null);
  };

  const resetFilters = () => {
    setDateRange(undefined);
    setCoordenacao('todos');
    setTema('todos');
    setStatus('todos');
    setSearchTerm('');
    updateSearchTerm('');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <DemandasSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      
      <FilterBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        coordenacao={coordenacao}
        onCoordenacaoChange={setCoordenacao}
        tema={tema}
        onTemaChange={setTema}
        status={status}
        onStatusChange={setStatus}
        onResetFilters={resetFilters}
      />
      
      {viewMode === 'cards' ? (
        <DemandaCards
          demandas={demandas as any}
          isLoading={isLoading}
          onSelectDemand={handleViewDemand as any}
        />
      ) : (
        <DemandasTable
          demandas={demandas as any}
          onViewDemand={handleViewDemand as any}
          onDelete={handleDelete as any}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          isAdmin={isAdmin}
        />
      )}
      
      {/* Detail Dialog */}
      {selectedDemand && (
        <DemandDetail 
          demand={selectedDemand as any} 
          isOpen={isDetailOpen} 
          onClose={handleCloseDetail}
        />
      )}
      
      {/* Delete Dialog */}
      {selectedDemand && (
        <DeleteDemandDialog
          isOpen={isDeleteModalOpen}
          demandId={selectedDemand.id}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ConsultarDemandasContent;
