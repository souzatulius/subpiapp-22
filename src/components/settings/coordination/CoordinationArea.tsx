
import React, { useState } from 'react';
import DataTable from '../data-table/DataTable';
import CoordinationForm from './CoordinationForm';
import CoordinationEditDialog from './CoordinationEditDialog';
import { useCoordination } from '@/hooks/settings/useCoordination';
import { toast } from '@/components/ui/use-toast';

const CoordinationArea = () => {
  const {
    coordinations,
    isLoading: loading,
    isSubmitting,
    addCoordination,
    updateCoordination: editCoordination,
    deleteCoordination
  } = useCoordination();
  
  const [editingCoordination, setEditingCoordination] = useState<any | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (coordination: any) => {
    setEditingCoordination(coordination);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingCoordination(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string, sigla: string }) => {
    if (!editingCoordination) return Promise.reject(new Error('Nenhuma coordenação selecionada'));
    
    try {
      await editCoordination({ id: editingCoordination.id, data });
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleEdit:', error);
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string, sigla: string }) => {
    try {
      await addCoordination(data);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleAdd:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a coordenação. Tente novamente.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  const handleDelete = (coordination: any) => {
    return deleteCoordination(coordination.id);
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'sigla',
      header: 'Sigla',
      render: (row: any) => row.sigla || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => {
    return (
      <CoordinationForm
        onSubmit={handleAdd}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <div>
      <DataTable
        title="Coordenações"
        data={coordinations || []}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar coordenações..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <CoordinationEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        coordination={editingCoordination}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CoordinationArea;
