
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ValidationError } from '@/lib/formValidationUtils';
import { Phone, Mail, MessageSquare, Building, Users, Flag } from 'lucide-react';
import Protocolo156 from './identification/Protocolo156';
import PriorityDeadlineStep from './PriorityDeadlineStep';

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
  // Initialize state based on formData to preserve values when returning to this step
  const [showProtocolFields, setShowProtocolFields] = useState(!!formData.origem_id);
  const [showPriorityFields, setShowPriorityFields] = useState(
    (formData.tem_protocolo_156 === false) || 
    (formData.tem_protocolo_156 === true && formData.numero_protocolo_156)
  );

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

  const handleOriginSelect = (id: string) => {
    handleSelectChange('origem_id', id);
    setShowProtocolFields(true);
  };

  const handleProtocol156Change = (checked: boolean) => {
    handleSelectChange('tem_protocolo_156', checked);
    
    // Se selecionou "Não", mostrar campos de prioridade
    if (!checked) {
      setShowPriorityFields(true);
    } else {
      // Se selecionou "Sim", só mostrar prioridade após preencher o número do protocolo
      setShowPriorityFields(!!formData.numero_protocolo_156);
    }
  };

  // Update state when protocol number changes
  useEffect(() => {
    if (formData.tem_protocolo_156 === true && formData.numero_protocolo_156) {
      setShowPriorityFields(true);
    }
  }, [formData.numero_protocolo_156]);

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="origem_id" 
          className={`block mb-2 text-lg font-medium ${hasError('origem_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          De onde vem a sua solicitação?
        </Label>
        <div className="flex flex-wrap gap-3">
          {origens.map(origem => (
            <Button 
              key={origem.id} 
              type="button" 
              variant={formData.origem_id === origem.id ? "default" : "outline"} 
              className={`h-auto py-2 px-3 flex items-center gap-2 ${
                formData.origem_id === origem.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('origem_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleOriginSelect(origem.id)}
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

      {formData.origem_id && showProtocolFields && (
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

      {/* Mostrar campos de prioridade apenas quando escolher "Não" para protocolo */}
      {showPriorityFields && formData.tem_protocolo_156 === false && (
        <div className="animate-fadeIn">
          <Separator className="my-4" />
          
          <PriorityDeadlineStep 
            formData={formData}
            handleSelectChange={handleSelectChange}
            errors={errors}
          />
        </div>
      )}

      {/* Se tem protocolo 156, mostrar o campo de prioridade após preencher o número */}
      {formData.tem_protocolo_156 === true && formData.numero_protocolo_156 && (
        <div className="animate-fadeIn">
          <Separator className="my-4" />
          
          <PriorityDeadlineStep 
            formData={formData}
            handleSelectChange={handleSelectChange}
            errors={errors}
          />
        </div>
      )}
    </div>
  );
};

export default ProtocolStep;
