
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
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const ConsultarDemandasContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { isAdmin } = usePermissions();
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showFilters, setShowFilters] = useState(false);
  
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

  const handleCreateNote = (demandId: string) => {
    navigate(`/dashboard/comunicacao/notas/criar?demandId=${demandId}`);
  };

  const handleViewNote = (notaId: string) => {
    navigate(`/dashboard/comunicacao/notas/detalhe?id=${notaId}`);
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <DemandasSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
        />
        
        <Button 
          variant="outline" 
          className="flex items-center gap-1.5"
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {showFilters && (
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
      )}
      
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
          onCreateNote={handleCreateNote}
          onViewNote={handleViewNote}
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
          onCreateNote={handleCreateNote}
          onViewNote={handleViewNote}
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
