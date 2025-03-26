
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ValidationError } from '@/lib/formValidationUtils';
import { Phone, Mail, MessageSquare, Building, Users, Flag } from 'lucide-react';
import Protocolo156 from './identification/Protocolo156';

interface ProtocolStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  origens: any[];
  tiposMidia: any[];
  errors?: ValidationError[];
  nextStep?: () => void;
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  origens,
  tiposMidia,
  errors = [],
  nextStep
}) => {

  // Função para obter o ícone com base na descrição da origem
  const getOriginIcon = (descricao: string) => {
    const iconMap: {
      [key: string]: React.ReactNode;
    } = {
      "Imprensa": <Mail className="h-5 w-5" />,
      "SMSUB": <Building className="h-5 w-5" />,
      "SECOM": <MessageSquare className="h-5 w-5" />,
      "Telefone": <Phone className="h-5 w-5" />,
      "Email": <Mail className="h-5 w-5" />,
      "Ouvidoria": <Users className="h-5 w-5" />,
      "Outros": <Flag className="h-5 w-5" />
    };
    return iconMap[descricao] || <Flag className="h-5 w-5" />;
  };

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const handleProtocol156Change = (checked: boolean) => {
    handleSelectChange('tem_protocolo_156', checked);
    
    // Se selecionou "Não", avança para a próxima etapa automaticamente
    if (!checked && nextStep) {
      setTimeout(nextStep, 300); // Pequeno atraso para melhor UX
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="origem_id" 
          className={`block mb-2 text-lg font-medium ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          De onde vem a sua solicitação?
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {origens.map(origem => (
            <Button 
              key={origem.id} 
              type="button" 
              variant={formData.origem_id === origem.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-xl ${
                formData.origem_id === origem.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('origem_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('origem_id', origem.id)}
            >
              {getOriginIcon(origem.descricao)}
              <span className="text-sm font-semibold">{origem.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('origem_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('origem_id')}</p>
        )}
      </div>

      {formData.origem_id && (
        <div className="animate-fadeIn">
          <Separator className="my-4" />
          
          <Protocolo156
            temProtocolo156={formData.tem_protocolo_156}
            numeroProtocolo156={formData.numero_protocolo_156}
            handleSelectChange={handleProtocol156Change}
            handleChange={handleChange}
            errors={errors}
          />
        </div>
      )}
    </div>
  );
};

export default ProtocolStep;
