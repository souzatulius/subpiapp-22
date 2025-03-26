
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';

interface ProtocolStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  errors: ValidationError[];
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
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
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="tem_protocolo_156"
          checked={formData.tem_protocolo_156 || false}
          onCheckedChange={(checked) => 
            handleSelectChange('tem_protocolo_156', checked === true)
          }
        />
        <Label 
          htmlFor="tem_protocolo_156" 
          className="font-normal cursor-pointer leading-tight"
        >
          Esta demanda possui um protocolo do SP156 associado?
        </Label>
      </div>

      {formData.tem_protocolo_156 && (
        <div className={hasError('numero_protocolo_156') ? 'error' : ''}>
          <Label htmlFor="numero_protocolo_156" className={hasError('numero_protocolo_156') ? 'text-destructive' : ''}>
            Número do Protocolo 156 *
          </Label>
          <Input
            id="numero_protocolo_156"
            name="numero_protocolo_156"
            value={formData.numero_protocolo_156 || ''}
            onChange={handleChange}
            placeholder="Digite o número do protocolo"
            className={hasError('numero_protocolo_156') ? 'border-red-500' : ''}
          />
          {hasError('numero_protocolo_156') && (
            <p className="text-sm font-medium text-destructive">{getErrorMessage('numero_protocolo_156')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProtocolStep;
