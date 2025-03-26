
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ValidationError } from '@/lib/formValidationUtils';

interface Protocolo156Props {
  temProtocolo156: boolean;
  numeroProtocolo156: string;
  handleSelectChange: (checked: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: ValidationError[];
}

const Protocolo156: React.FC<Protocolo156Props> = ({
  temProtocolo156,
  numeroProtocolo156,
  handleSelectChange,
  handleChange,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="tem_protocolo_156" 
          checked={temProtocolo156} 
          onCheckedChange={handleSelectChange}
        />
        <label 
          htmlFor="tem_protocolo_156" 
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Essa demanda tem protocolo aberto no 156?
        </label>
      </div>
      
      {temProtocolo156 && (
        <div className="animate-fadeIn">
          <Input 
            id="numero_protocolo_156" 
            name="numero_protocolo_156" 
            value={numeroProtocolo156} 
            onChange={handleChange} 
            placeholder="Digite aqui os 10 dígitos do protocolo" 
            className={`w-full ${hasError('numero_protocolo_156') ? 'border-orange-500' : ''}`}
            maxLength={10}
          />
          {hasError('numero_protocolo_156') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('numero_protocolo_156')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Protocolo156;
