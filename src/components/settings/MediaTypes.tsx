
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import MediaTypeForm from './media-types/MediaTypeForm';
import MediaTypeEditDialog from './media-types/MediaTypeEditDialog';
import { useMediaTypes, MediaType } from '@/hooks/useMediaTypes';
import { 
  Video, 
  Image, 
  Music, 
  FileText, 
  Newspaper, 
  Radio, 
  Tv, 
  Youtube,
  MessageSquare,
  File
} from 'lucide-react';

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

  // Function to determine the appropriate icon based on media type description
  const getMediaTypeIcon = (description: string) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('vídeo')) return <Video className="h-5 w-5 text-blue-600" />;
    if (desc.includes('imagem') || desc.includes('foto')) return <Image className="h-5 w-5 text-green-600" />;
    if (desc.includes('áudio') || desc.includes('audio')) return <Music className="h-5 w-5 text-purple-600" />;
    if (desc.includes('jornal')) return <Newspaper className="h-5 w-5 text-yellow-600" />;
    if (desc.includes('documento') || desc.includes('pdf')) return <FileText className="h-5 w-5 text-orange-600" />;
    if (desc.includes('rádio') || desc.includes('radio')) return <Radio className="h-5 w-5 text-red-600" />;
    if (desc.includes('tv') || desc.includes('televisão')) return <Tv className="h-5 w-5 text-indigo-600" />;
    if (desc.includes('youtube') || desc.includes('vídeo online')) return <Youtube className="h-5 w-5 text-red-500" />;
    if (desc.includes('rede') || desc.includes('social')) return <MessageSquare className="h-5 w-5 text-blue-500" />;
    
    // Default icon
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
      render: (row: MediaType) => (
        <div className="flex items-center gap-2">
          {getMediaTypeIcon(row.descricao)}
          <span>{row.descricao}</span>
        </div>
      ),
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
