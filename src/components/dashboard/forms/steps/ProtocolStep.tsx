
import React from 'react';
import OriginStep from './OriginStep';
import Protocolo156 from './identification/Protocolo156';
import PriorityDeadlineStep from './PriorityDeadlineStep';
import { ValidationError } from '@/lib/formValidationUtils';

interface ProtocolStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
    prazo_resposta: string;
    prioridade: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  origens: any[];
  tiposMidia: any[];
  errors: ValidationError[];
  nextStep?: () => void;
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  origens,
  tiposMidia,
  errors,
  nextStep
}) => {
  // Determine if we should show the protocol section
  const showProtocolField = formData.origem_id !== '';
  
  // Show priority when "No" is selected for 156 protocol or when a protocol number is provided
  const showPrioritySection = showProtocolField && (
    formData.tem_protocolo_156 === false || 
    (formData.tem_protocolo_156 === true && formData.numero_protocolo_156 && formData.numero_protocolo_156.trim() !== '')
  );

  return (
    <div className="space-y-6">
      <OriginStep
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        origens={origens}
        errors={errors}
      />
      
      {showProtocolField && (
        <div className="animate-fadeIn">
          <Protocolo156
            temProtocolo156={formData.tem_protocolo_156}
            numeroProtocolo156={formData.numero_protocolo_156}
            handleSelectChange={(value) => handleSelectChange('tem_protocolo_156', value)}
            handleChange={handleChange}
            errors={errors}
          />
        </div>
      )}
      
      {showPrioritySection && (
        <div className="mt-6 animate-fadeIn">
          <PriorityDeadlineStep
            formData={formData}
            handleSelectChange={handleSelectChange}
            errors={errors}
          />
        </div>
      )}
    </div>
  );
};

export default ProtocolStep;
