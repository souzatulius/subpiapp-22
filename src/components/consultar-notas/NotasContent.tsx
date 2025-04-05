
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import NotasFilter from './NotasFilter';
import NotasTable from './NotasTable';
import NotaDetailDialog from './NotaDetailDialog';
import DeleteNotaDialog from './DeleteNotaDialog';
import NotasCards from './NotasCards';
import { useDemandasData } from '@/hooks/consultar-demandas/useDemandasData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotasData } from '@/hooks/consultar-notas/useNotasData';
import { NotaOficial } from '@/types/nota';

const NotasContent = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    filteredNotas,
    isLoading,
    handleDeleteNota,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedNotaId,
    setSelectedNotaId
  } = useNotasData();
  
  // State for table vs cards view
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // State for detail dialog
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleViewNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedNota(null);
  };
  
  const handleEditNota = (id: string) => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${id}`);
  };
  
  const handleDeleteClick = (id: string) => {
    setSelectedNotaId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedNotaId) {
      handleDeleteNota(selectedNotaId);
    }
  };
  
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedNotaId(null);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Consultar Notas Oficiais</h1>
      
      <Card className="mb-6 border border-gray-200">
        <CardContent className="p-6">
          <NotasFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange as [Date, Date]}
            setDateRange={setDateRange as (range: [Date, Date]) => void}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </CardContent>
      </Card>
      
      {viewMode === 'table' ? (
        <NotasTable 
          notas={filteredNotas}
          loading={isLoading}
          formatDate={formatDate}
          onViewNota={handleViewNota}
          onEditNota={handleEditNota}
          onDeleteNota={handleDeleteClick}
        />
      ) : (
        <NotasCards 
          notas={filteredNotas}
          loading={isLoading}
          formatDate={formatDate}
          onViewNota={handleViewNota}
          onEditNota={handleEditNota}
          onDeleteNota={handleDeleteClick}
        />
      )}
      
      {/* Detail Dialog */}
      {selectedNota && (
        <NotaDetailDialog 
          nota={selectedNota}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          formatDate={formatDate}
        />
      )}
      
      {/* Delete Dialog */}
      <DeleteNotaDialog 
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default NotasContent;
