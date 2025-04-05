
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
  
  const handleEditNota = (nota: NotaOficial) => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${nota.id}`);
  };
  
  const handleDeleteClick = (nota: NotaOficial) => {
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
            dateRange={dateRange}
            setDateRange={setDateRange}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </CardContent>
      </Card>
      
      {viewMode === 'table' ? (
        <NotasTable 
          notas={filteredNotas}
          loading={loading}
          formatDate={formatDate}
          onViewNota={handleViewNota}
          onEditNota={handleEditNota}
          onDeleteNota={handleDeleteClick}
        />
      ) : (
        <NotasCards 
          notas={filteredNotas}
          loading={loading}
          formatDate={formatDate}
          onView={handleViewNota}
          onEdit={handleEditNota}
          onDelete={handleDeleteClick}
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
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        notaTitle={selectedNota?.titulo || "esta nota"}
      />
    </div>
  );
};

export default NotasContent;
