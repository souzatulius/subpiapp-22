
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import Protocolo156 from './identification/Protocolo156';

interface ProtocolStepProps {
  formData: {
    origem_id: string;
    prazo_resposta: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  origens: any[];
  tiposMidia: any[];
  errors: ValidationError[];
  nextStep?: () => void;
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  origens,
  errors,
  nextStep
}) => {
  const handleProtocolSelectChange = (checked: boolean) => {
    handleSelectChange('tem_protocolo_156', checked);
  };

  return (
    <div className="space-y-6">
      {/* Origem da Demanda */}
      <div>
        <Label 
          htmlFor="origem_id" 
          className={hasFieldError('origem_id', errors) ? 'text-orange-500' : ''}
        >
          Origem da Demanda
        </Label>
        <Select
          value={formData.origem_id}
          onValueChange={(value) => handleSelectChange('origem_id', value)}
        >
          <SelectTrigger 
            className={`w-full ${hasFieldError('origem_id', errors) ? 'border-orange-500' : ''}`}
          >
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
        {hasFieldError('origem_id', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('origem_id', errors)}</p>
        )}
      </div>

      {/* Protocolo 156 */}
      <Protocolo156 
        temProtocolo156={formData.tem_protocolo_156}
        numeroProtocolo156={formData.numero_protocolo_156}
        handleSelectChange={handleProtocolSelectChange}
        handleChange={handleChange}
        errors={errors}
      />

      {/* Prazo para Resposta */}
      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={hasFieldError('prazo_resposta', errors) ? 'text-orange-500' : ''}
        >
          Prazo para Resposta
        </Label>
        <Input
          type="date"
          id="prazo_resposta"
          name="prazo_resposta"
          value={formData.prazo_resposta ? formData.prazo_resposta.split('T')[0] : ''}
          onChange={handleChange}
          className={hasFieldError('prazo_resposta', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('prazo_resposta', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prazo_resposta', errors)}</p>
        )}
      </div>
    </div>
  );
};

export default ProtocolStep;
