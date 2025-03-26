
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';

interface OriginStepProps {
  formData: any;
  origens: any[];
  tiposMidia: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
}

const OriginStep: React.FC<OriginStepProps> = ({
  formData,
  origens,
  tiposMidia,
  handleChange,
  handleSelectChange,
  errors
}) => {
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <FormItem className={hasError('origem_id') ? 'error' : ''}>
        <FormLabel>Origem da Demanda *</FormLabel>
        <Select
          value={formData.origem_id}
          onValueChange={(value) => handleSelectChange('origem_id', value)}
        >
          <FormControl>
            <SelectTrigger className={hasError('origem_id') ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione a origem" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {origens.map((origem) => (
              <SelectItem key={origem.id} value={origem.id}>
                {origem.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError('origem_id') && (
          <FormMessage>{getErrorMessage('origem_id')}</FormMessage>
        )}
      </FormItem>

      {formData.origem_id === '1' && (
        <FormItem className={hasError('tipo_midia_id') ? 'error' : ''}>
          <FormLabel>Tipo de Mídia *</FormLabel>
          <Select
            value={formData.tipo_midia_id}
            onValueChange={(value) => handleSelectChange('tipo_midia_id', value)}
          >
            <FormControl>
              <SelectTrigger className={hasError('tipo_midia_id') ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tipo de mídia" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {tiposMidia.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError('tipo_midia_id') && (
            <FormMessage>{getErrorMessage('tipo_midia_id')}</FormMessage>
          )}
        </FormItem>
      )}
    </div>
  );
};

export default OriginStep;
