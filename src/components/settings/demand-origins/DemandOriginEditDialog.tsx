
import React from 'react';
import EditModal from '../EditModal';
import DemandOriginForm from './DemandOriginForm';

export interface DemandOrigin {
  id: string;
  descricao: string;
  criado_em: string;
}

interface DemandOriginEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  demandOrigin: DemandOrigin | null;
  onSubmit: (data: { descricao: string }) => Promise<void>;
  isSubmitting: boolean;
}

const DemandOriginEditDialog: React.FC<DemandOriginEditDialogProps> = ({
  isOpen,
  onClose,
  demandOrigin,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !demandOrigin) return null;

  return (
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Origem de Demanda"
    >
      <DemandOriginForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValue={demandOrigin.descricao}
        isSubmitting={isSubmitting}
        submitText="Salvar Alterações"
      />
    </EditModal>
  );
};

export default DemandOriginEditDialog;
