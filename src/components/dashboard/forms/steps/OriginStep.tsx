
import React from 'react';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';
import { Button } from '@/components/ui/button';
import { useOriginIcon } from '@/hooks/useOriginIcon';

interface OriginStepProps {
  formData: {
    origem_id: string;
    prazo_resposta: string;
    prioridade: string;
    tem_protocolo_156?: boolean;
    numero_protocolo_156?: string;
  };
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  origens: any[];
  errors: ValidationError[];
}

const OriginStep: React.FC<OriginStepProps> = ({
  formData,
  handleSelectChange,
  handleChange,
  origens,
  errors
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Allow deselection of origin
  const handleOriginClick = (originId: string) => {
    if (formData.origem_id === originId) {
      handleSelectChange('origem_id', ''); // Deselect if clicking the same origin
    } else {
      handleSelectChange('origem_id', originId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="origem_id" 
          className={`form-question-title ${hasFieldError('origem_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          De onde vem a sua solicitação? {hasFieldError('origem_id', errors) && <span className="text-orange-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {origens.map(origem => (
            <Button 
              key={origem.id} 
              type="button" 
              variant={formData.origem_id === origem.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 selection-button rounded-xl ${
                formData.origem_id === origem.id ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
              } ${
                hasFieldError('origem_id', errors) ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleOriginClick(origem.id)}
            >
              {useOriginIcon(origem, "h-8 w-8")}
              <span className="text-sm font-semibold">{origem.descricao}</span>
            </Button>
          ))}
        </div>
        {hasFieldError('origem_id', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('origem_id', errors)}</p>
        )}
      </div>
    </div>
  );
};

export default OriginStep;
