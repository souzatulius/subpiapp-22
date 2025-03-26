
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ValidationError } from '@/lib/formValidationUtils';

interface ProtocolStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  origens: any[];
  tiposMidia: any[];
  errors: ValidationError[];
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  origens,
  tiposMidia,
  errors
}) => {
  const hasProtocolError = errors.some(err => err.field === 'numero_protocolo_156' && err.when === 'tem_protocolo_156');
  const hasOrigemError = errors.some(err => err.field === 'origem_id');
  const hasTipoMidiaError = errors.some(err => err.field === 'tipo_midia_id');

  return (
    <div className="space-y-6">
      {/* Protocolo 156 section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Protocolo 156</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="tem_protocolo_156"
            checked={formData.tem_protocolo_156}
            onCheckedChange={(checked) => handleSelectChange('tem_protocolo_156', checked)}
          />
          <label
            htmlFor="tem_protocolo_156"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Esta demanda possui protocolo do 156?
          </label>
        </div>

        {formData.tem_protocolo_156 && (
          <div className="mt-4">
            <FormItem className="space-y-2">
              <FormLabel>Número do Protocolo 156</FormLabel>
              <FormControl>
                <Input
                  name="numero_protocolo_156"
                  value={formData.numero_protocolo_156 || ''}
                  onChange={handleChange}
                  placeholder="Ex: SP1234567890"
                  className={hasProtocolError ? 'border-red-500' : ''}
                />
              </FormControl>
              {hasProtocolError && (
                <p className="text-sm text-red-500">Informe o número do protocolo 156</p>
              )}
            </FormItem>
          </div>
        )}
      </div>

      {/* Origem section */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">Origem da Demanda</h3>
        
        <FormItem className="space-y-2">
          <FormLabel>Origem da Demanda</FormLabel>
          <Select
            value={formData.origem_id || ''}
            onValueChange={(value) => handleSelectChange('origem_id', value)}
          >
            <SelectTrigger className={hasOrigemError ? 'border-red-500' : ''}>
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
          {hasOrigemError && (
            <p className="text-sm text-red-500">Origem da demanda é obrigatória</p>
          )}
        </FormItem>

        <FormItem className="space-y-2">
          <FormLabel>Tipo de Mídia</FormLabel>
          <Select
            value={formData.tipo_midia_id || ''}
            onValueChange={(value) => handleSelectChange('tipo_midia_id', value)}
          >
            <SelectTrigger className={hasTipoMidiaError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o tipo de mídia" />
            </SelectTrigger>
            <SelectContent>
              {tiposMidia.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasTipoMidiaError && (
            <p className="text-sm text-red-500">Tipo de mídia é obrigatório</p>
          )}
        </FormItem>
      </div>
    </div>
  );
};

export default ProtocolStep;
