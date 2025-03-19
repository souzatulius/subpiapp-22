
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import MediaTypeForm from './media-types/MediaTypeForm';
import MediaTypeEditDialog from './media-types/MediaTypeEditDialog';
import { useMediaTypes, MediaType } from '@/hooks/useMediaTypes';

const MediaTypes = () => {
  const { 
    mediaTypes, 
    loading,
    isSubmitting,
    addMediaType,
    updateMediaType,
    deleteMediaType
  } = useMediaTypes();
  
  const [editingMediaType, setEditingMediaType] = useState<MediaType | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (mediaType: MediaType) => {
    setEditingMediaType(mediaType);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingMediaType(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string }) => {
    if (!editingMediaType) return Promise.reject(new Error('Nenhum tipo de mídia selecionado'));
    
    try {
      await updateMediaType(editingMediaType.id, data);
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string }) => {
    try {
      await addMediaType(data);
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
    <MediaTypeForm
      onSubmit={handleAdd}
      onCancel={onClose}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Tipos de Mídia"
        data={mediaTypes}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteMediaType}
        filterPlaceholder="Filtrar tipos de mídia..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      {editingMediaType && (
        <MediaTypeEditDialog
          isOpen={isEditFormOpen}
          onClose={closeEditForm}
          mediaType={editingMediaType}
          onSubmit={handleEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default MediaTypes;
