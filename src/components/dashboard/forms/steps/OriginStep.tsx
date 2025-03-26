import React from 'react';
import { ValidationError } from '@/lib/formValidationUtils';

interface OriginStepProps {
  formData: any;
  origens: any[];
  tiposMidia: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
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
  // This step has been merged with the Protocol step
  // Keeping component for backward compatibility, but with empty content
  return (
    <div className="space-y-6">
      <p className="text-gray-500 italic">
        Os campos de origem da demanda foram movidos para a primeira etapa.
      </p>
    </div>
  );
};

export default OriginStep;
