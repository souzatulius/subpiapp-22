
import React from 'react';
import Protocolo156 from './identification/Protocolo156';
import OriginClassificationStep from './OriginClassificationStep';
import { ValidationError } from '@/lib/formValidationUtils';

interface ProtocolStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  origens: any[];
  tiposMidia: any[];
  errors?: ValidationError[];
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  origens,
  tiposMidia,
  errors = []
}) => {
  return (
    <div className="space-y-8">
      <Protocolo156 
        temProtocolo156={formData.tem_protocolo_156}
        numeroProtocolo156={formData.numero_protocolo_156}
        handleSelectChange={(checked) => handleSelectChange('tem_protocolo_156', checked)}
        handleChange={handleChange}
        errors={errors}
      />
      
      <OriginClassificationStep 
        formData={{
          origem_id: formData.origem_id,
          tipo_midia_id: formData.tipo_midia_id,
          veiculo_imprensa: formData.veiculo_imprensa
        }}
        handleSelectChange={(name, value) => handleSelectChange(name, value)}
        handleChange={handleChange}
        origens={origens}
        tiposMidia={tiposMidia}
        errors={errors}
      />
    </div>
  );
};

export default ProtocolStep;
