import React, { useState } from 'react';
import DataTable from '../data-table/DataTable';
import SupervisionEditDialog from './SupervisionEditDialog';
import SupervisionForm from './SupervisionForm';
import { useCoordinationAreas } from '@/hooks/coordination-areas/useCoordinationAreas';
import { toast } from '@/components/ui/use-toast';

const SupervisionsArea = () => {
  const {
    areas,
    coordinations,
    loading,
    isSubmitting,
    addArea,
    updateArea,
    deleteArea
  } = useCoordinationAreas();
  
  const [editingArea, setEditingArea] = useState<any | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (area: any) => {
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

  const handleEdit = async (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
    if (!editingArea) return Promise.reject(new Error('Nenhuma supervisão técnica selecionada'));
    
    try {
      await updateArea(editingArea.id, data);
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleEdit:', error);
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
    try {
      await addArea(data);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleAdd:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a supervisão técnica. Tente novamente.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleDelete = async (area: any) => {
    if (!area || !area.id) {
      console.error('Attempted to delete area without ID:', area);
      toast({
        title: "Erro",
        description: "ID da supervisão técnica não encontrado.",
        variant: "destructive",
      });
      return false;
    }
    return deleteArea(area.id);
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
      key: 'coordenacao',
      header: 'Coordenação',
      render: (row: any) => {
        const coordination = coordinations.find(c => c.id === row.coordenacao_id);
        return coordination ? coordination.descricao : (row.coordenacao || '-');
      },
    }
  ];

  const renderForm = (onClose: () => void) => {
    return (
      <SupervisionForm
        onSubmit={handleAdd}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        coordinations={coordinations}
      />
    );
  };

  return (
    <div>
      <DataTable
        title="Supervisões Técnicas"
        data={areas || []}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar supervisões técnicas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <SupervisionEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        area={editingArea}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
        coordinations={coordinations}
      />
    </div>
  );
};

export default SupervisionsArea;
