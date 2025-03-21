
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LocationStepProps {
  formData: {
    endereco: string;
    bairro_id: string;
  };
  selectedDistrito: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
  errors?: ValidationError[];
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  selectedDistrito,
  handleChange,
  handleSelectChange,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="endereco" className={`block ${hasError('endereco') ? 'text-orange-500 font-semibold' : ''}`}>
          Endereço
        </Label>
        <Input 
          id="endereco" 
          name="endereco" 
          value={formData.endereco} 
          onChange={handleChange} 
          placeholder="Rua e Número"
          className={hasError('endereco') ? 'border-orange-500' : ''}
        />
        {hasError('endereco') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('endereco')}</p>}
      </div>

      <div>
        <Label htmlFor="distrito" className="block mb-2">
          Distrito
        </Label>
        
        <RadioGroup
          value={selectedDistrito}
          onValueChange={(value) => {
            setSelectedDistrito(value);
            handleSelectChange('bairro_id', ''); // Reset bairro when distrito changes
          }}
          className="grid grid-cols-2 gap-2 md:grid-cols-3"
        >
          {distritos.map(distrito => (
            <div key={distrito.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
              <RadioGroupItem value={distrito.id} id={`distrito-${distrito.id}`} />
              <Label htmlFor={`distrito-${distrito.id}`} className="cursor-pointer">
                {distrito.nome}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedDistrito && (
        <div className="animate-fadeIn">
          <Label htmlFor="bairro_id" className={`block mb-2 ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}>
            Bairro
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredBairros.length > 0 ? (
              filteredBairros.map(bairro => (
                <button
                  key={bairro.id}
                  type="button"
                  onClick={() => handleSelectChange('bairro_id', bairro.id)}
                  className={`p-2 text-sm text-center rounded-md border transition-colors 
                    ${formData.bairro_id === bairro.id 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-background border-input hover:bg-muted'
                    } ${hasError('bairro_id') ? 'border-orange-500' : ''}`}
                >
                  {bairro.nome}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full">Selecione um distrito primeiro</p>
            )}
          </div>
          {hasError('bairro_id') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('bairro_id')}</p>}
        </div>
      )}
    </div>
  );
};

export default LocationStep;
