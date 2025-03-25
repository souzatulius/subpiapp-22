
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import CoordinationAreaForm from './coordination-areas/CoordinationAreaForm';
import CoordinationAreaEditDialog from './coordination-areas/CoordinationAreaEditDialog';
import { useCoordinationAreas, Area } from '@/hooks/useCoordinationAreas';
import { toast } from '@/components/ui/use-toast';

const CoordinationAreas = () => {
  const {
    areas,
    coordinations,
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
      console.log('CoordinationAreas handling add:', data);
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
        coordinations={coordinations}
      />
    );
  };

  // Fix: Properly extract the ID when deleting an area
  const handleDelete = (area: Area) => {
    return deleteArea(area.id);
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
      
      <CoordinationAreaEditDialog
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

export default CoordinationAreas;
