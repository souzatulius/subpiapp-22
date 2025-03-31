
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
  // Allow deselection of protocol option
  const handleProtocolClick = (value: boolean) => {
    if (temProtocolo156 === value) {
      // Set to undefined to deselect
      handleSelectChange(undefined as any);
    } else {
      handleSelectChange(value);
    }
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
          variant={temProtocolo156 === true ? "default" : "outline"}
          className={`selection-button ${temProtocolo156 === true ? "bg-orange-500 text-white" : ""}`}
          onClick={() => handleProtocolClick(true)}
        >
          Sim
        </Button>
        <Button
          type="button"
          variant={temProtocolo156 === false ? "default" : "outline"}
          className={`selection-button ${temProtocolo156 === false ? "bg-orange-500 text-white" : ""}`}
          onClick={() => handleProtocolClick(false)}
        >
          Não
        </Button>
      </div>
      
      {temProtocolo156 === true && (
        <div className="animate-fadeIn">
          <Input
            id="numero_protocolo_156"
            name="numero_protocolo_156"
            value={numeroProtocolo156}
            onChange={handleChange}
            placeholder="Informe os 10 dígitos"
            className={hasFieldError('numero_protocolo_156', errors) ? 'border-orange-500' : ''}
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={10}
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
