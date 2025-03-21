
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    <div className="space-y-4">
      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input 
          id="endereco" 
          name="endereco" 
          value={formData.endereco} 
          onChange={handleChange} 
          placeholder="Rua e Número"
        />
      </div>
      
      <div>
        <Label htmlFor="distrito">Distrito</Label>
        <RadioGroup value={selectedDistrito} onValueChange={setSelectedDistrito} className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {distritos.map(distrito => (
              <div key={distrito.id} className="flex items-center space-x-2">
                <RadioGroupItem value={distrito.id} id={`distrito-${distrito.id}`} />
                <Label htmlFor={`distrito-${distrito.id}`} className="cursor-pointer">
                  {distrito.nome}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label 
          htmlFor="bairro_id"
          className={`block ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Bairro {hasError('bairro_id') && <span className="text-orange-500">*</span>}
        </Label>
        <Select 
          value={formData.bairro_id} 
          onValueChange={value => handleSelectChange('bairro_id', value)} 
          disabled={!selectedDistrito}
        >
          <SelectTrigger className={`rounded-lg ${hasError('bairro_id') ? 'border-orange-500 ring-orange-500' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filteredBairros.map(bairro => (
              <SelectItem key={bairro.id} value={bairro.id}>
                {bairro.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError('bairro_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('bairro_id')}</p>
        )}
      </div>
    </div>
  );
};

export default LocationStep;
