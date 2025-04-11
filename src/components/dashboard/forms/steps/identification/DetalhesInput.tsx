
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError, hasFieldError, getFieldErrorMessage } from '@/lib/formValidationUtils';

interface DetalhesInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: ValidationError[];
  label?: string;
}

const DetalhesInput: React.FC<DetalhesInputProps> = ({
  value,
  onChange,
  errors,
  label = "Detalhes da solicitação"
}) => {
  return (
    <div>
      <label 
        htmlFor="detalhes_solicitacao" 
        className={`form-question-title ${hasFieldError('detalhes_solicitacao', errors) ? 'text-orange-500 font-semibold' : ''}`}
      >
        {label} {hasFieldError('detalhes_solicitacao', errors) && <span className="text-orange-500">*</span>}
      </label>
      <Textarea 
        id="detalhes_solicitacao" 
        name="detalhes_solicitacao" 
        value={value || ''}
        onChange={onChange}
        placeholder="Forneça mais detalhes sobre a solicitação..."
        className={`min-h-[150px] ${hasFieldError('detalhes_solicitacao', errors) ? 'border-orange-500' : ''}`}
      />
      {hasFieldError('detalhes_solicitacao', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('detalhes_solicitacao', errors)}</p>
      )}
    </div>
  );
};

export default DetalhesInput;
