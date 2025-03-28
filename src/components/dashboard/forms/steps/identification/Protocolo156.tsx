
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';

interface Protocolo156Props {
  temProtocolo156?: boolean;
  numeroProtocolo156?: string;
  handleSelectChange: (value: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
}

const Protocolo156: React.FC<Protocolo156Props> = ({
  temProtocolo156,
  numeroProtocolo156 = '',
  handleSelectChange,
  handleChange,
  errors
}) => {
  // Function to determine button variant based on selection
  const getButtonVariant = (isSelected: boolean, currentValue?: boolean) => {
    if (currentValue === undefined) return "outline";
    return isSelected === currentValue ? "default" : "outline";
  };

  // Function to determine button class based on selection
  const getButtonClass = (isSelected: boolean, currentValue?: boolean) => {
    if (currentValue === undefined) return "";
    return isSelected === currentValue ? "bg-orange-500 text-white" : "";
  };

  return (
    <div className="space-y-3">
      <Label
        htmlFor="tem_protocolo_156"
        className="form-question-title"
      >
        Essa solicitação já tem protocolo do 156?
      </Label>
      
      <div className="flex gap-3">
        <Button
          type="button"
          variant={getButtonVariant(true, temProtocolo156)}
          className={`selection-button ${getButtonClass(true, temProtocolo156)}`}
          onClick={() => handleSelectChange(true)}
        >
          Sim
        </Button>
        <Button
          type="button"
          variant={getButtonVariant(false, temProtocolo156)}
          className={`selection-button ${getButtonClass(false, temProtocolo156)}`}
          onClick={() => handleSelectChange(false)}
        >
          Não
        </Button>
      </div>
      
      {temProtocolo156 && (
        <div className="animate-fadeIn">
          <Label
            htmlFor="numero_protocolo_156"
            className={`block ${hasFieldError('numero_protocolo_156', errors) ? 'text-orange-500 font-semibold' : ''}`}
          >
            Número do protocolo {hasFieldError('numero_protocolo_156', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Input
            id="numero_protocolo_156"
            name="numero_protocolo_156"
            value={numeroProtocolo156}
            onChange={handleChange}
            placeholder="Digite aqui os 10 dígitos"
            className={hasFieldError('numero_protocolo_156', errors) ? 'border-orange-500' : ''}
          />
          {hasFieldError('numero_protocolo_156', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('numero_protocolo_156', errors)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Protocolo156;
