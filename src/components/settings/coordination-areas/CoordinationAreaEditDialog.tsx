
import React from 'react';
import EditModal from '../EditModal';
import CoordinationAreaForm from './CoordinationAreaForm';
import { Area } from '@/hooks/useCoordinationAreas';

interface CoordinationAreaEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
  onSubmit: (data: { descricao: string, sigla?: string, coordenacao?: string }) => Promise<void>;
  isSubmitting: boolean;
}

const CoordinationAreaEditDialog: React.FC<CoordinationAreaEditDialogProps> = ({
  isOpen,
  onClose,
  area,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !area) return null;

  return (
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Área de Coordenação"
    >
      <CoordinationAreaForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValues={{
          descricao: area.descricao,
          sigla: area.sigla || '',
          coordenacao: area.coordenacao || '',
        }}
        isSubmitting={isSubmitting}
        submitText="Salvar Alterações"
      />
    </EditModal>
  );
};

export default CoordinationAreaEditDialog;
