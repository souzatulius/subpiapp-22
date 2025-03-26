
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
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
  const getError = (fieldName: string) => {
    return errors.find(error => error.field === fieldName);
  };

  const hasError = (fieldName: string) => {
    return errors.some(error => error.field === fieldName);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="tem_protocolo_156"
            checked={formData.tem_protocolo_156}
            onCheckedChange={(checked) => handleSelectChange('tem_protocolo_156', checked)}
          />
          <Label htmlFor="tem_protocolo_156">Demanda possui protocolo 156?</Label>
        </div>
        
        {formData.tem_protocolo_156 && (
          <div>
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Número do Protocolo 156</FormLabel>
              <FormControl>
                <Input
                  id="numero_protocolo_156"
                  name="numero_protocolo_156"
                  value={formData.numero_protocolo_156 || ''}
                  onChange={handleChange}
                  className={hasError('numero_protocolo_156') ? 'border-red-500' : ''}
                  placeholder="Insira o número do protocolo"
                />
              </FormControl>
              {hasError('numero_protocolo_156') && (
                <FormMessage>{getError('numero_protocolo_156')?.message}</FormMessage>
              )}
            </FormItem>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormItem className="space-y-1">
            <FormLabel className="text-sm">Origem da demanda</FormLabel>
            <FormControl>
              <Select
                value={formData.origem_id || ''}
                onValueChange={(value) => handleSelectChange('origem_id', value)}
              >
                <SelectTrigger className={hasError('origem_id') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {origens.map((origem) => (
                    <SelectItem key={origem.id} value={origem.id}>
                      {origem.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {hasError('origem_id') && (
              <FormMessage>{getError('origem_id')?.message}</FormMessage>
            )}
          </FormItem>
        </div>
        
        <div>
          <FormItem className="space-y-1">
            <FormLabel className="text-sm">Tipo de mídia</FormLabel>
            <FormControl>
              <Select
                value={formData.tipo_midia_id || ''}
                onValueChange={(value) => handleSelectChange('tipo_midia_id', value)}
                disabled={!origens.some(o => o.id === formData.origem_id && o.descricao.includes('Imprensa'))}
              >
                <SelectTrigger>
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
            </FormControl>
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default ProtocolStep;
