
import React from 'react';
import TemaSelector from './identification/TemaSelector';
import DetalhesInput from './identification/DetalhesInput';
import Protocolo156 from './identification/Protocolo156';
import { ValidationError } from '@/lib/formValidationUtils';

interface IdentificationStepProps {
  formData: {
    problema_id: string;
    detalhes_solicitacao: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
  };
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
      <TemaSelector
        problemas={problemas}
        selectedProblemaId={formData.problema_id}
        onSelectProblema={(id) => handleSelectChange('problema_id', id)}
        errors={errors}
      />
      
      <DetalhesInput
        value={formData.detalhes_solicitacao}
        handleChange={handleChange}
        errors={errors}
      />
      
      <Protocolo156
        temProtocolo={formData.tem_protocolo_156 || false}
        numeroProtocolo={formData.numero_protocolo_156 || ''}
        handleCheckboxChange={(checked) => handleSelectChange('tem_protocolo_156', checked)}
        handleInputChange={handleChange}
        errors={errors}
      />
    </div>
  );
};

export default IdentificationStep;
