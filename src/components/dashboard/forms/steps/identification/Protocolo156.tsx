
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';

interface Protocolo156Props {
  temProtocolo156: boolean;
  numeroProtocolo156: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const Protocolo156: React.FC<Protocolo156Props> = ({
  temProtocolo156,
  numeroProtocolo156,
  handleChange,
  handleSelectChange,
  errors = []
}) => {
  const hasError = (field: string) => hasFieldError(field, errors);
  const getErrorMessage = (field: string) => getFieldErrorMessage(field, errors);

  const handleProtocoloChange = (value: string) => {
    handleSelectChange('tem_protocolo_156', value === 'true');
  };

  const handleNumeroProtocoloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length <= 10) { // Limita a 10 dígitos
      const inputEvent = {
        target: {
          name: 'numero_protocolo_156',
          value
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(inputEvent);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="tem_protocolo_156" 
          className={`block mb-2 ${hasError('tem_protocolo_156') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Existe protocolo aberto no 156? {hasError('tem_protocolo_156') && <span className="text-orange-500">*</span>}
        </Label>
        <RadioGroup 
          value={temProtocolo156 ? 'true' : 'false'} 
          onValueChange={handleProtocoloChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="protocolo-sim" />
            <Label htmlFor="protocolo-sim">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="protocolo-nao" />
            <Label htmlFor="protocolo-nao">Não</Label>
          </div>
        </RadioGroup>
        {hasError('tem_protocolo_156') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('tem_protocolo_156')}</p>
        )}
      </div>

      {temProtocolo156 && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="numero_protocolo_156" 
            className={`block mb-2 ${hasError('numero_protocolo_156') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Número do Protocolo 156 {hasError('numero_protocolo_156') && <span className="text-orange-500">*</span>}
          </Label>
          <Input 
            id="numero_protocolo_156" 
            name="numero_protocolo_156" 
            type="text"
            value={numeroProtocolo156 || ''} 
            onChange={handleNumeroProtocoloChange}
            placeholder="Digite os 10 dígitos do protocolo" 
            maxLength={10}
            className={`${hasError('numero_protocolo_156') ? 'border-orange-500' : ''}`}
          />
          {hasError('numero_protocolo_156') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('numero_protocolo_156')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Protocolo156;
