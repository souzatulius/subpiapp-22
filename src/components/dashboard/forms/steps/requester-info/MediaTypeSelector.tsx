
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useMediaTypeIcon } from '@/hooks/useMediaTypeIcon';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface MediaTypeSelectorProps {
  tiposMidia: any[];
  formData: {
    tipo_midia_id: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({
  tiposMidia,
  formData,
  handleSelectChange,
  errors
}) => {
  return (
    <div className="animate-fadeIn">
      <Label 
        htmlFor="tipo_midia_id" 
        className={`form-question-title ${hasFieldError('tipo_midia_id', errors) ? 'text-orange-500' : ''}`}
      >
        Tipo de Mídia {hasFieldError('tipo_midia_id', errors) && <span className="text-orange-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tiposMidia.map(tipo => (
          <Button 
            key={tipo.id} 
            type="button" 
            variant={formData.tipo_midia_id === tipo.id ? "default" : "outline"} 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 selection-button ${
              formData.tipo_midia_id === tipo.id ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
            } ${
              hasFieldError('tipo_midia_id', errors) ? 'border-orange-500' : ''
            }`} 
            onClick={() => handleSelectChange('tipo_midia_id', tipo.id)}
          >
            {useMediaTypeIcon(tipo, "h-6 w-6")}
            <span className="text-sm font-semibold">{tipo.descricao}</span>
          </Button>
        ))}
      </div>
      {hasFieldError('tipo_midia_id', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('tipo_midia_id', errors)}</p>
      )}
    </div>
  );
};

export default MediaTypeSelector;
