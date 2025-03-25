
import React from 'react';
import TemaSelector from './identification/TemaSelector';
import DetalhesInput from './identification/DetalhesInput';
import { ValidationError } from '@/lib/formValidationUtils';

interface IdentificationStepProps {
  formData: {
    problema_id: string;
    detalhes_solicitacao: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  problemas: any[];
  errors?: ValidationError[];
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  problemas,
  errors = []
}) => {
  return (
    <div className="space-y-4">
      <TemaSelector
        problemas={problemas}
        selectedTemaId={formData.problema_id}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
      
      <DetalhesInput
        value={formData.detalhes_solicitacao}
        handleChange={handleChange}
        errors={errors}
      />
    </div>
  );
};

export default IdentificationStep;
