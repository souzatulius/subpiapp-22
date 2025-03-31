
import React from 'react';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';
import AddressInput from './AddressInput';

interface LocationSectionProps {
  endereco: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  bairros: any[];
  bairroId: string;
  errors?: ValidationError[];
}

const LocationSection: React.FC<LocationSectionProps> = ({
  endereco,
  handleChange,
  handleSelectChange,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  bairros,
  bairroId,
  errors = []
}) => {
  const handleAddressSelect = (address: string) => {
    // Here we could potentially try to extract district/neighborhood information from the address
    // and auto-select them if possible
    console.log("Selected address:", address);
  };

  return (
    <div className="space-y-6">
      <AddressInput
        value={endereco}
        onChange={handleChange}
        onAddressSelect={handleAddressSelect}
        errors={errors}
      />
      
      <div>
        <Label 
          htmlFor="distrito" 
          className="block mb-2"
        >
          Distrito
        </Label>
        <Select
          value={selectedDistrito}
          onValueChange={(value) => setSelectedDistrito(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map((distrito) => (
              <SelectItem key={distrito.id} value={distrito.id}>
                {distrito.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label 
          htmlFor="bairro_id" 
          className={`block mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          Bairro
        </Label>
        <Select
          value={bairroId}
          onValueChange={(value) => handleSelectChange('bairro_id', value)}
          disabled={!selectedDistrito}
        >
          <SelectTrigger className={`w-full ${hasFieldError('bairro_id', errors) ? 'border-orange-500' : ''}`}>
            <SelectValue placeholder="Selecione um bairro" />
          </SelectTrigger>
          <SelectContent>
            {bairros.map((bairro) => (
              <SelectItem key={bairro.id} value={bairro.id}>
                {bairro.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFieldError('bairro_id', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('bairro_id', errors)}</p>
        )}
        {selectedDistrito && bairros.length === 0 && (
          <p className="text-gray-500 text-sm mt-1">Nenhum bairro encontrado para este distrito.</p>
        )}
        {!selectedDistrito && (
          <p className="text-gray-500 text-sm mt-1">Selecione um distrito primeiro.</p>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
