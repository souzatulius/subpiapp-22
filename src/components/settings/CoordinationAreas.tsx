
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import CoordinationAreaForm from './coordination-areas/CoordinationAreaForm';
import CoordinationAreaEditDialog from './coordination-areas/CoordinationAreaEditDialog';
import { useCoordinationAreas, Area } from '@/hooks/useCoordinationAreas';
import { toast } from '@/components/ui/use-toast';

const CoordinationAreas = () => {
  const {
    areas,
    loading,
    isSubmitting,
    addArea,
    updateArea,
    deleteArea
  } = useCoordinationAreas();
  
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (area: Area) => {
    setEditingArea(area);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingArea(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string }) => {
    if (!editingArea) return Promise.reject(new Error('Nenhuma área selecionada'));
    
    try {
      await updateArea(editingArea.id, data.descricao);
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleEdit:', error);
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string }) => {
    try {
      console.log('CoordinationAreas handling add:', data);
      await addArea(data.descricao);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleAdd:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a área. Tente novamente.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  // Define the renderForm function that returns a function component
  const renderForm = (onClose: () => void) => {
    return (
      <CoordinationAreaForm
        onSubmit={handleAdd}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <div>
      <DataTable
        title="Áreas de Coordenação"
        data={areas || []}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteArea}
        filterPlaceholder="Filtrar áreas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <CoordinationAreaEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        area={editingArea}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CoordinationAreas;
