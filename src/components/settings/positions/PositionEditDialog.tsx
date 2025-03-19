
import React from 'react';
import EditModal from '../EditModal';
import PositionForm from './PositionForm';
import { Position } from '@/hooks/usePositions';

interface PositionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position | null;
  onSubmit: (data: { descricao: string }) => Promise<void>;
  isSubmitting: boolean;
}

const PositionEditDialog: React.FC<PositionEditDialogProps> = ({
  isOpen,
  onClose,
  position,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !position) return null;

  return (
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Cargo"
    >
      <PositionForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValue={position.descricao}
        isSubmitting={isSubmitting}
        submitText="Salvar Alterações"
      />
    </EditModal>
  );
};

export default PositionEditDialog;
