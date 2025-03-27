
import React from 'react';
import OriginStep from './OriginStep';
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
  return (
    <div>
      <OriginStep
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        origens={origens}
        errors={errors}
      />
    </div>
  );
};

export default ProtocolStep;
