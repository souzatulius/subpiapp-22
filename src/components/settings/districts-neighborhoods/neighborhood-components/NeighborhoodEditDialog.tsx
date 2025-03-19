
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import NeighborhoodForm from '../NeighborhoodForm';

interface NeighborhoodEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingNeighborhood: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  districts: any[];
}

const NeighborhoodEditDialog: React.FC<NeighborhoodEditDialogProps> = ({
  isOpen,
  onOpenChange,
  editingNeighborhood,
  onSubmit,
  isSubmitting,
  districts,
}) => {
  if (!editingNeighborhood) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Bairro</DialogTitle>
        </DialogHeader>
        
        <NeighborhoodForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          defaultValues={{
            nome: editingNeighborhood.nome,
            distrito_id: editingNeighborhood.distrito_id,
          }}
          onCancel={() => onOpenChange(false)}
          districts={districts}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NeighborhoodEditDialog;
