
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface MediaVehicleFieldProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
}

const MediaVehicleField: React.FC<MediaVehicleFieldProps> = ({
  value,
  handleChange,
  errors
}) => {
  return (
    <div className="animate-fadeIn">
      <Label 
        htmlFor="veiculo_imprensa" 
        className={`form-question-title ${hasFieldError('veiculo_imprensa', errors) ? 'text-orange-500' : ''}`}
      >
        Veículo de Imprensa {hasFieldError('veiculo_imprensa', errors) && <span className="text-orange-500">*</span>}
      </Label>
      <Input
        id="veiculo_imprensa"
        name="veiculo_imprensa"
        value={value || ''}
        onChange={handleChange}
        placeholder="Nome do veículo de imprensa"
        className={hasFieldError('veiculo_imprensa', errors) ? 'border-orange-500' : ''}
      />
      {hasFieldError('veiculo_imprensa', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('veiculo_imprensa', errors)}</p>
      )}
    </div>
  );
};

export default MediaVehicleField;
