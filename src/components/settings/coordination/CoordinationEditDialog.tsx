
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CoordinationForm from './CoordinationForm';

interface CoordinationEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coordination: any | null;
  onSubmit: (data: { descricao: string, sigla: string }) => Promise<void>;
  isSubmitting: boolean;
}

const CoordinationEditDialog: React.FC<CoordinationEditDialogProps> = ({
  isOpen,
  onClose,
  coordination,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !coordination) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Coordenação</DialogTitle>
        </DialogHeader>
        
        <CoordinationForm
          onSubmit={onSubmit}
          onCancel={onClose}
          defaultValues={{
            descricao: coordination.descricao,
            sigla: coordination.sigla || '',
          }}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoordinationEditDialog;
