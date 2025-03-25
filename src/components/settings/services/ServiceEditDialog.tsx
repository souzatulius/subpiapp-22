
import React from 'react';
import EditModal from '../EditModal';
import ServiceForm from './ServiceForm';
import { Service, Area } from '@/hooks/services/types';

interface ServiceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; area_coordenacao_id: string }) => Promise<void>;
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
          area_coordenacao_id: service.area_coordenacao_id,
        }}
        areas={areas}
        isSubmitting={isSubmitting}
      />
    </EditModal>
  );
};

export default ServiceEditDialog;
