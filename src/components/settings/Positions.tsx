
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import PositionForm from './positions/PositionForm';
import PositionEditDialog from './positions/PositionEditDialog';
import { usePositions, Position } from '@/hooks/usePositions';

const Positions = () => {
  const {
    positions,
    loading,
    isSubmitting,
    addPosition,
    updatePosition,
    deletePosition
  } = usePositions();
  
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (position: Position) => {
    setEditingPosition(position);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingPosition(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string }) => {
    if (!editingPosition) return Promise.reject(new Error('Nenhum cargo selecionado'));
    
    try {
      await updatePosition(editingPosition.id, data);
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string }) => {
    try {
      await addPosition(data);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
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

  const renderForm = (onClose: () => void) => (
    <PositionForm
      onSubmit={handleAdd}
      onCancel={onClose}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Cargos"
        data={positions}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deletePosition}
        filterPlaceholder="Filtrar cargos..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      {editingPosition && (
        <PositionEditDialog
          isOpen={isEditFormOpen}
          onClose={closeEditForm}
          position={editingPosition}
          onSubmit={handleEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Positions;
