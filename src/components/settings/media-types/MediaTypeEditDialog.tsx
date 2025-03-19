
import React from 'react';
import EditModal from '../EditModal';
import MediaTypeForm from './MediaTypeForm';
import { MediaType } from '@/hooks/useMediaTypes';

interface MediaTypeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: MediaType | null;
  onSubmit: (data: { descricao: string }) => Promise<void>;
  isSubmitting: boolean;
}

const MediaTypeEditDialog: React.FC<MediaTypeEditDialogProps> = ({
  isOpen,
  onClose,
  mediaType,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !mediaType) return null;

  return (
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Tipo de Mídia"
    >
      <MediaTypeForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValue={mediaType.descricao}
        isSubmitting={isSubmitting}
        submitText="Salvar Alterações"
      />
    </EditModal>
  );
};

export default MediaTypeEditDialog;
