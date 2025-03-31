
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DemandOriginForm from './DemandOriginForm';
import { DemandOrigin } from '@/hooks/useDemandOrigins';

interface DemandOriginEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  demandOrigin: DemandOrigin;
  onSubmit: (data: { descricao: string, icone: string }) => Promise<void>;
  isSubmitting: boolean;
}

const DemandOriginEditDialog: React.FC<DemandOriginEditDialogProps> = ({
  isOpen,
  onClose,
  demandOrigin,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Origem de Demanda</DialogTitle>
        </DialogHeader>
        <DemandOriginForm
          onSubmit={onSubmit}
          onCancel={onClose}
          defaultValue={demandOrigin.descricao}
          defaultIcon={demandOrigin.icone || 'MessageCircle'} 
          isSubmitting={isSubmitting}
          submitText="Atualizar"
        />
      </DialogContent>
    </Dialog>
  );
};

export default DemandOriginEditDialog;
