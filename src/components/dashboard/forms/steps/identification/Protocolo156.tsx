
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
  temProtocolo156 = false,
  numeroProtocolo156 = '',
  handleSelectChange,
  handleChange,
  errors
}) => {
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
          onClick={() => handleSelectChange(true)}
        >
          Sim
        </Button>
        <Button
          type="button"
          variant={temProtocolo156 === false && temProtocolo156 !== undefined ? "default" : "outline"}
          className={`selection-button ${temProtocolo156 === false && temProtocolo156 !== undefined ? "bg-orange-500 text-white" : ""}`}
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
            placeholder="Ex.: SP-ABC-12345"
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
