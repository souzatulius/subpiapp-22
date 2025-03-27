
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LocationStepProps {
  formData: {
    endereco: string;
    bairro_id: string;
    email_solicitante: string;
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
  
  // Show fields progressively based on previous field completion
  const [showDistrito, setShowDistrito] = useState(false);
  const [showBairro, setShowBairro] = useState(false);
  const [showEndereco, setShowEndereco] = useState(false);
  
  useEffect(() => {
    // Show district when email is entered
    setShowDistrito(!!formData.email_solicitante);
    
    // Show bairro when distrito is selected
    setShowBairro(!!selectedDistrito);
    
    // Show endereco when bairro is selected
    setShowEndereco(!!formData.bairro_id);
  }, [formData.email_solicitante, selectedDistrito, formData.bairro_id]);

  return (
    <div className="space-y-6">
      {showDistrito && (
        <div className="animate-fadeIn">
          <Label htmlFor="distrito" className="block mb-2 text-base">
            Distrito
          </Label>
          
          <div className="flex flex-wrap gap-2">
            {distritos.map(distrito => (
              <Button 
                key={distrito.id}
                type="button"
                variant={selectedDistrito === distrito.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedDistrito(distrito.id);
                  handleSelectChange('bairro_id', ''); // Reset bairro when distrito changes
                }}
                className="flex-1 min-w-[130px] max-w-[200px] h-auto py-2"
              >
                {distrito.nome}
              </Button>
            ))}
          </div>
          {hasError('distrito') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('distrito')}</p>}
        </div>
      )}

      {showBairro && (
        <div className="animate-fadeIn">
          <Label htmlFor="bairro_id" className={`block mb-2 ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}>
            Bairro
          </Label>
          <div className="flex flex-wrap gap-2">
            {filteredBairros.length > 0 ? (
              filteredBairros.map(bairro => (
                <Button
                  key={bairro.id}
                  type="button"
                  variant={formData.bairro_id === bairro.id ? "default" : "outline"}
                  onClick={() => handleSelectChange('bairro_id', bairro.id)}
                  className={`flex-1 min-w-[120px] max-w-[180px] h-auto py-2 ${
                    hasError('bairro_id') ? 'border-orange-500' : ''
                  }`}
                >
                  {bairro.nome}
                </Button>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full">Selecione um distrito primeiro</p>
            )}
          </div>
          {hasError('bairro_id') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('bairro_id')}</p>}
        </div>
      )}

      {showEndereco && (
        <div className="animate-fadeIn">
          <Label htmlFor="endereco" className={`block mb-2 ${hasError('endereco') ? 'text-orange-500 font-semibold' : ''}`}>
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
      )}
    </div>
  );
};

export default LocationStep;
