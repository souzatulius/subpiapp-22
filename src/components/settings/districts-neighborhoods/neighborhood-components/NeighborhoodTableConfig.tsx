
import React from 'react';
import NeighborhoodAddForm from '../neighborhood-forms/NeighborhoodAddForm';

export const getNeighborhoodColumns = () => [
  {
    key: 'nome',
    header: 'Nome',
  },
  {
    key: 'distritos',
    header: 'Distrito',
    render: (row: any) => row.distritos?.nome || '-',
  },
  {
    key: 'criado_em',
    header: 'Data de Criação',
    render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
  },
];

interface RenderNeighborhoodFormProps {
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  districts: any[];
}

export const renderNeighborhoodForm = ({ 
  onSubmit, 
  onClose, 
  isSubmitting,
  districts 
}: RenderNeighborhoodFormProps) => {
  return (
    <NeighborhoodAddForm
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
      districts={districts}
    />
  );
};
