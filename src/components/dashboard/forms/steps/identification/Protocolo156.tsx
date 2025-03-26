
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';

interface Protocolo156Props {
  temProtocolo156?: boolean;
  numeroProtocolo156?: string;
  handleSelectChange: (checked: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: ValidationError[];
}

const Protocolo156: React.FC<Protocolo156Props> = ({
  temProtocolo156,
  numeroProtocolo156 = '',
  handleSelectChange,
  handleChange,
  errors = []
}) => {
  return (
    <div className="space-y-4">
      <Label className="block mb-2 text-lg font-medium">
        Essa solicitação já tem protocolo no 156?
      </Label>
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant={temProtocolo156 ? "default" : "outline"} 
          onClick={() => handleSelectChange(true)}
          className="rounded-xl"
        >
          Sim
        </Button>
        <Button 
          type="button" 
          variant={temProtocolo156 === false ? "default" : "outline"} 
          onClick={() => handleSelectChange(false)}
          className="rounded-xl"
        >
          Não
        </Button>
      </div>
      
      {temProtocolo156 && (
        <div className="mt-4 animate-fadeIn">
          <Input 
            id="numero_protocolo_156" 
            name="numero_protocolo_156" 
            value={numeroProtocolo156} 
            onChange={handleChange}
            className={`rounded-xl ${hasFieldError('numero_protocolo_156', errors) ? 'border-orange-500' : ''}`}
            placeholder="Digite aqui os 10 dígitos do protocolo"
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
