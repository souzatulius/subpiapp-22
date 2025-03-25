
import React from 'react';
import TemaSelector from './identification/TemaSelector';
import DetalhesInput from './identification/DetalhesInput';
import Protocolo156 from './identification/Protocolo156';
import { ValidationError } from '@/lib/formValidationUtils';

export interface IdentificationStepProps {
  formData: {
    problema_id: string;
    detalhes_solicitacao: string;
    tem_protocolo_156: boolean;
    numero_protocolo_156?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  problemas: any[];
  errors?: ValidationError[];
  // These props are passed but not used in this component anymore
  handleServiceSelect?: (serviceId: string) => void;
  filteredServicesBySearch?: any[];
  serviceSearch?: string;
  servicos?: any[];
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
      
      <Protocolo156
        temProtocolo156={formData.tem_protocolo_156}
        numeroProtocolo156={formData.numero_protocolo_156 || ''}
        handleChange={handleChange}
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
