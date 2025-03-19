
import React, { useState } from 'react';
import DataTable from './DataTable';
import CoordinationAreaForm from './coordination-areas/CoordinationAreaForm';
import CoordinationAreaEditDialog from './coordination-areas/CoordinationAreaEditDialog';
import { useCoordinationAreas, Area } from '@/hooks/useCoordinationAreas';

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
    
    await updateArea(editingArea.id, data);
    closeEditForm();
    return Promise.resolve();
  };

  const handleAdd = async (data: { descricao: string }) => {
    await addArea(data);
    closeAddForm();
    return Promise.resolve();
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

  const renderForm = () => (
    <CoordinationAreaForm
      onSubmit={handleAdd}
      onCancel={closeAddForm}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Áreas de Coordenação"
        data={areas}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteArea}
        filterPlaceholder="Filtrar áreas..."
        renderForm={isAddFormOpen ? renderForm : undefined}
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
