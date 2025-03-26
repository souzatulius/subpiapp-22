
import React from 'react';
import EditModal from '../EditModal';
import SupervisionForm from './SupervisionForm';
import { Area } from '@/hooks/coordination-areas/useCoordinationAreas';
import { Coordination } from '@/hooks/settings/useCoordination';

interface SupervisionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
  onSubmit: (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => Promise<void>;
  isSubmitting: boolean;
  coordinations?: Coordination[];
}

const SupervisionEditDialog: React.FC<SupervisionEditDialogProps> = ({
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
      <SupervisionForm
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

export default SupervisionEditDialog;
