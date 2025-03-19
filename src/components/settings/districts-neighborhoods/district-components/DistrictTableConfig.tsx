
import React from 'react';
import DistrictAddForm from '../district-forms/DistrictAddForm';

export const getDistrictColumns = () => [
  {
    key: 'nome',
    header: 'Nome',
  },
  {
    key: 'criado_em',
    header: 'Data de Criação',
    render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
  },
];

interface RenderDistrictFormProps {
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export const renderDistrictForm = ({ 
  onSubmit, 
  onClose, 
  isSubmitting 
}: RenderDistrictFormProps) => {
  return (
    <DistrictAddForm
      onSubmit={async (data) => {
        try {
          await onSubmit(data);
          onClose();
        } catch (error) {
          console.error('Error in form submission:', error);
        }
      }}
      onCancel={onClose}
      isSubmitting={isSubmitting}
    />
  );
};
