
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import NotasFilter from './NotasFilter';
import NotasTable from './NotasTable';
import NotaDetailDialog from './NotaDetailDialog';
import DeleteNotaDialog from './DeleteNotaDialog';
import NotasCards from './NotasCards';
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
    filteredNotas,
    loading,
    handleDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedNotaId,
    setSelectedNotaId,
    deleteLoading,
    refetch
  } = useNotasData();
  
  // State for table vs cards view
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // State for detail dialog
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  
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
  
  const handleDeleteClick = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setSelectedNotaId(nota.id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedNotaId) {
      handleDelete(selectedNotaId);
    }
  };
  
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedNotaId(null);
    setSelectedNota(null);
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
      
      <Card className="mb-6 border border-gray-200 rounded-xl">
        <CardContent className="p-6">
          <NotasFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </CardContent>
      </Card>
      
      {viewMode === 'table' ? (
        <div className="rounded-xl overflow-hidden">
          <NotasTable 
            notas={filteredNotas}
            loading={loading}
            formatDate={formatDate}
            onViewNota={handleViewNota}
            onEditNota={(nota: NotaOficial) => handleEditNota(nota.id)}
            onDeleteNota={handleDeleteClick}
          />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden">
          <NotasCards 
            notas={filteredNotas}
            loading={loading}
            formatDate={formatDate}
            onView={handleViewNota}
            onEdit={(nota: NotaOficial) => handleEditNota(nota.id)}
            onDelete={handleDeleteClick}
          />
        </div>
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
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        notaTitle={selectedNota?.titulo || "esta nota"}
        hasDemanda={!!selectedNota?.demanda_id}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default NotasContent;
