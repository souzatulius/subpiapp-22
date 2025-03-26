
import React from 'react';
import { Label } from '@/components/ui/label';
import OriginClassificationStep from '../OriginClassificationStep';
import { ValidationError } from '@/lib/formValidationUtils';

interface OriginStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
  };
  origens: any[];
  tiposMidia: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  errors: ValidationError[];
}

const OriginStep: React.FC<OriginStepProps> = ({
  formData,
  origens,
  tiposMidia,
  handleChange,
  handleSelectChange,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Origem e Classificação da Demanda
        </Label>
        <p className="text-sm text-gray-500 mb-4">
          Selecione a origem da demanda e sua classificação
        </p>
      </div>

      <OriginClassificationStep
        formData={formData}
        origens={origens}
        tiposMidia={tiposMidia}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        errors={errors}
      />
    </div>
  );
};

export default OriginStep;
