
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';
import ServiceSearch from './identification/ServiceSearch';

interface LocationStepProps {
  formData: {
    endereco: string;
    bairro_id: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros
}) => {
  // Toggle district selection to allow deselection
  const toggleDistrito = (distritoId: string) => {
    if (selectedDistrito === distritoId) {
      setSelectedDistrito('');
      handleSelectChange('bairro_id', '');
    } else {
      setSelectedDistrito(distritoId);
      handleSelectChange('bairro_id', '');
    }
  };

  // Toggle bairro selection to allow deselection
  const toggleBairro = (bairroId: string) => {
    handleSelectChange('bairro_id', formData.bairro_id === bairroId ? '' : bairroId);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="endereco" 
          className={`text-lg font-medium block mb-2 ${hasFieldError('endereco', errors) ? 'text-orange-500' : 'text-blue-950'}`}
        >
          Endereço {hasFieldError('endereco', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          placeholder="Rua e Número - Ex: Av. São João, 473"
          className={hasFieldError('endereco', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('endereco', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('endereco', errors)}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="distrito" 
          className={`text-lg font-medium block mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500' : 'text-blue-950'}`}
        >
          Distrito {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {distritos.map(distrito => (
            <Button
              key={distrito.id}
              type="button"
              variant={selectedDistrito === distrito.id ? "default" : "outline"}
              className={`rounded-xl selection-button ${
                selectedDistrito === distrito.id ? "bg-orange-500 text-white" : ""
              } ${
                hasFieldError('bairro_id', errors) ? 'border-orange-500' : ''
              } hover:bg-orange-500 hover:text-white`}
              onClick={() => toggleDistrito(distrito.id)}
            >
              {distrito.nome}
            </Button>
          ))}
        </div>
      </div>

      {selectedDistrito && filteredBairros.length > 0 && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="bairro_id" 
            className={`text-lg font-medium block mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500' : 'text-blue-950'}`}
          >
            Bairro {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredBairros.map(bairro => (
              <Button
                key={bairro.id}
                type="button"
                variant={formData.bairro_id === bairro.id ? "default" : "outline"}
                className={`rounded-xl selection-button ${
                  formData.bairro_id === bairro.id ? "bg-orange-500 text-white" : ""
                } ${
                  hasFieldError('bairro_id', errors) ? 'border-orange-500' : ''
                } hover:bg-orange-500 hover:text-white`}
                onClick={() => toggleBairro(bairro.id)}
              >
                {bairro.nome}
              </Button>
            ))}
          </div>
          {hasFieldError('bairro_id', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('bairro_id', errors)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationStep;
