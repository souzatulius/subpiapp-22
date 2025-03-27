
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MediaTypeForm from './MediaTypeForm';
import { MediaType } from '@/hooks/useMediaTypes';

interface MediaTypeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: MediaType;
  onSubmit: (data: { descricao: string; icone?: string }) => Promise<void>;
  isSubmitting: boolean;
}

const MediaTypeEditDialog: React.FC<MediaTypeEditDialogProps> = ({
  isOpen,
  onClose,
  mediaType,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tipo de Mídia</DialogTitle>
        </DialogHeader>
        <MediaTypeForm
          onSubmit={onSubmit}
          onCancel={onClose}
          initialValues={{
            descricao: mediaType.descricao,
            icone: mediaType.icone || ''
          }}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MediaTypeEditDialog;
