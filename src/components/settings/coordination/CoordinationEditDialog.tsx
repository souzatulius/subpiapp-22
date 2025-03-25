
import React from 'react';
import EditModal from '../EditModal';
import CoordinationForm from './CoordinationForm';

interface Coordination {
  id: string;
  descricao: string;
  sigla: string;
  criado_em: string;
}

interface CoordinationEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coordination: Coordination | null;
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
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Coordenação"
    >
      <CoordinationForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValues={{
          descricao: coordination.descricao,
          sigla: coordination.sigla || '',
        }}
        isSubmitting={isSubmitting}
        submitText="Salvar Alterações"
      />
    </EditModal>
  );
};

export default CoordinationEditDialog;
