
import React from 'react';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import OriginClassificationStep from '../OriginClassificationStep';

interface OriginStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  origens: any[];
  tiposMidia: any[];
  errors: ValidationError[];
}

const OriginStep: React.FC<OriginStepProps> = ({
  formData,
  handleSelectChange,
  handleChange,
  origens,
  tiposMidia,
  errors
}) => {
  return (
    <div className="space-y-6">
      <OriginClassificationStep
        formData={{
          origem_id: formData.origem_id,
          tipo_midia_id: '', // We're moving this to Step 4, so don't show it here
          veiculo_imprensa: ''
        }}
        handleSelectChange={handleSelectChange}
        handleChange={handleChange}
        origens={origens}
        tiposMidia={[]} // Pass empty array since we don't want to show media types here
        errors={errors}
      />
    </div>
  );
};

export default OriginStep;
