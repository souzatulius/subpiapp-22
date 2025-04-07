
import React from 'react';
import { ESICProcessoFormValues } from '@/types/esic';
import ProcessoForm from '@/components/esic/ProcessoForm';

interface ProcessoCreateProps {
  onSubmit: (values: ESICProcessoFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const ProcessoCreate: React.FC<ProcessoCreateProps> = ({
  onSubmit,
  isLoading,
  onCancel
}) => {
  return (
    <ProcessoForm 
      onSubmit={onSubmit} 
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default ProcessoCreate;
