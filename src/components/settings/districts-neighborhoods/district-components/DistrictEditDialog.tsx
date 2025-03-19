
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DistrictForm from '../DistrictForm';

interface DistrictEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingDistrict: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const DistrictEditDialog: React.FC<DistrictEditDialogProps> = ({
  isOpen,
  onOpenChange,
  editingDistrict,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Distrito</DialogTitle>
        </DialogHeader>
        
        {isOpen && editingDistrict && (
          <DistrictForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            defaultValues={editingDistrict ? { nome: editingDistrict.nome } : undefined}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DistrictEditDialog;
