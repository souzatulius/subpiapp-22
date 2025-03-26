
import React from 'react';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface OriginStepProps {
  formData: any;
  origens: any[];
  tiposMidia: any[];
  handleSelectChange: (name: string, value: string | boolean) => void;
  errors: ValidationError[];
}

const OriginStep: React.FC<OriginStepProps> = ({
  formData,
  origens,
  tiposMidia,
  handleSelectChange,
  errors
}) => {
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="origem_id" className={hasError('origem_id') ? 'text-destructive' : ''}>
          Origem da Demanda *
        </Label>
        <Select
          value={formData.origem_id || ''}
          onValueChange={(value) => handleSelectChange('origem_id', value)}
        >
          <SelectTrigger id="origem_id" className={hasError('origem_id') ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione a origem da demanda" />
          </SelectTrigger>
          <SelectContent>
            {origens.map((origem) => (
              <SelectItem key={origem.id} value={origem.id}>
                {origem.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError('origem_id') && (
          <p className="text-sm font-medium text-destructive">{getErrorMessage('origem_id')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tipo_midia_id">
          Tipo de Mídia
        </Label>
        <Select
          value={formData.tipo_midia_id || ''}
          onValueChange={(value) => handleSelectChange('tipo_midia_id', value)}
        >
          <SelectTrigger id="tipo_midia_id">
            <SelectValue placeholder="Selecione o tipo de mídia (opcional)" />
          </SelectTrigger>
          <SelectContent>
            {tiposMidia.map((tipo) => (
              <SelectItem key={tipo.id} value={tipo.id}>
                {tipo.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OriginStep;
