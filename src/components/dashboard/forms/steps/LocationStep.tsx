
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';

interface LocationStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (distrito: string) => void;
  filteredBairros: any[];
  errors?: ValidationError[];
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  distritos,
  selectedDistrito,
  setSelectedDistrito,
  filteredBairros,
  errors = []
}) => {
  const handleDistritoClick = (distritoId: string) => {
    // Se o distrito já está selecionado, desmarque-o
    if (selectedDistrito === distritoId) {
      setSelectedDistrito('');
      // Limpar também o bairro selecionado quando desmarca o distrito
      handleSelectChange('bairro_id', '');
    } else {
      setSelectedDistrito(distritoId);
      // Limpar também o bairro selecionado quando muda o distrito
      handleSelectChange('bairro_id', '');
    }
  };

  const handleBairroClick = (bairroId: string) => {
    // Se o bairro já está selecionado, desmarque-o
    if (formData.bairro_id === bairroId) {
      handleSelectChange('bairro_id', '');
    } else {
      handleSelectChange('bairro_id', bairroId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="endereco" 
          className={`font-medium text-lg block mb-2 ${hasFieldError('endereco', errors) ? 'text-orange-500' : 'text-blue-950'}`}
        >
          Endereço {hasFieldError('endereco', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="endereco"
          name="endereco"
          value={formData.endereco || ''}
          onChange={handleChange}
          className={`rounded-xl ${hasFieldError('endereco', errors) ? 'border-orange-500' : ''}`}
          placeholder="Rua e Número - Ex: Av. São João, 473"
        />
        {hasFieldError('endereco', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('endereco', errors)}</p>
        )}
      </div>

      <div>
        <Label 
          className={`font-medium text-lg block mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500' : 'text-blue-950'}`}
        >
          Distrito {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          {distritos.map(distrito => (
            <Button
              key={distrito.id}
              type="button"
              variant={selectedDistrito === distrito.id ? "default" : "outline"}
              className={`h-auto py-2 text-center justify-center rounded-lg
                ${selectedDistrito === distrito.id 
                  ? "bg-orange-500 text-white hover:bg-orange-600" 
                  : "hover:bg-orange-500 hover:text-white"
                }
              `}
              onClick={() => handleDistritoClick(distrito.id)}
            >
              <span className="text-sm">{distrito.nome}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedDistrito && filteredBairros.length > 0 && (
        <div className="animate-fadeIn">
          <Label 
            className={`font-medium text-lg block mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500' : 'text-blue-950'}`}
          >
            Bairro {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredBairros.map(bairro => (
              <Button
                key={bairro.id}
                type="button"
                variant={formData.bairro_id === bairro.id ? "default" : "outline"}
                className={`h-auto py-2 text-center justify-center rounded-lg
                  ${formData.bairro_id === bairro.id 
                    ? "bg-orange-500 text-white hover:bg-orange-600" 
                    : "hover:bg-orange-500 hover:text-white"
                  }
                `}
                onClick={() => handleBairroClick(bairro.id)}
              >
                <span className="text-sm">{bairro.nome}</span>
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
