
import React from 'react';
import EditModal from '../EditModal';
import ServiceForm from './ServiceForm';
import { Service } from '@/types/service';
import { SupervisaoTecnica } from '@/types/common';

interface ServiceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  areas: SupervisaoTecnica[];
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ServiceEditDialog: React.FC<ServiceEditDialogProps> = ({
  isOpen,
  onClose,
  service,
  areas,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen || !service) return null;

  return (
    <EditModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Problema"
    >
      <ServiceForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValues={{
          descricao: service.descricao,
          supervisao_tecnica_id: service.supervisao_id || '',
        }}
        areas={areas}
        isSubmitting={isSubmitting}
      />
    </EditModal>
  );
};

export default ServiceEditDialog;
