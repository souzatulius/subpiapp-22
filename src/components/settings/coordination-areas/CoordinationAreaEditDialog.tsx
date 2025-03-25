
import React from 'react';
import EditModal from '../EditModal';
import CoordinationAreaForm from './CoordinationAreaForm';
import { Area } from '@/hooks/coordination-areas/useCoordinationAreas';
import { Coordination } from '@/hooks/settings/useCoordination';

interface CoordinationAreaEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
  onSubmit: (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => Promise<void>;
  isSubmitting: boolean;
  coordinations?: Coordination[];
}

const CoordinationAreaEditDialog: React.FC<CoordinationAreaEditDialogProps> = ({
  isOpen,
  onClose,
  area,
  onSubmit,
  isSubmitting,
  coordinations = []
}) => {
  if (!isOpen || !area) return null;

  return (
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Supervisão Técnica"
    >
      <CoordinationAreaForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValues={{
          descricao: area.descricao,
          sigla: area.sigla || '',
          coordenacao_id: area.coordenacao_id || '',
        }}
        isSubmitting={isSubmitting}
        submitText="Salvar Alterações"
        coordinations={coordinations}
      />
    </EditModal>
  );
};

export default CoordinationAreaEditDialog;
