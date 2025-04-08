
import React from 'react';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import ProcessoForm from '@/components/esic/ProcessoForm';

interface ProcessoEditProps {
  processo: ESICProcesso;
  onSubmit: (values: ESICProcessoFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const ProcessoEdit: React.FC<ProcessoEditProps> = ({
  processo,
  onSubmit,
  isLoading,
  onCancel
}) => {
  return (
    <ProcessoForm 
      onSubmit={onSubmit} 
      initialValues={processo}
      isLoading={isLoading}
      mode="edit"
      onCancel={onCancel}
    />
  );
};

export default ProcessoEdit;
