
import React from 'react';
import TemaSelector from './identification/TemaSelector';
import Protocolo156 from './identification/Protocolo156';
import { ValidationError } from '@/lib/formValidationUtils';

export interface IdentificationStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
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
    <div className="space-y-6">
      <Protocolo156
        temProtocolo156={formData.tem_protocolo_156}
        numeroProtocolo156={formData.numero_protocolo_156}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
      
      <TemaSelector
        problemas={problemas}
        selectedTemaId={formData.problema_id}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
    </div>
  );
};

export default IdentificationStep;
