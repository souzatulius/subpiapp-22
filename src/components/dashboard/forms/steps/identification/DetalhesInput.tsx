
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';

interface DetalhesInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors?: ValidationError[];
}

const DetalhesInput: React.FC<DetalhesInputProps> = ({ 
  value, 
  onChange, 
  errors = [] 
}) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor="detalhes_solicitacao" 
        className={`block text-base font-semibold ${hasFieldError('detalhes_solicitacao', errors) ? 'text-orange-500' : ''}`}
      >
        Descreva a situação {hasFieldError('detalhes_solicitacao', errors) && <span className="text-orange-500">*</span>}
      </Label>
      
      <Textarea
        id="detalhes_solicitacao"
        name="detalhes_solicitacao"
        value={value}
        onChange={onChange}
        rows={5}
        placeholder="Inclua aqui o contexto ou cole o e-mail recebido"
        className={`resize-none ${hasFieldError('detalhes_solicitacao', errors) ? 'border-orange-500' : ''}`}
      />
      
      {hasFieldError('detalhes_solicitacao', errors) && (
        <p className="text-orange-500 text-sm">{getFieldErrorMessage('detalhes_solicitacao', errors)}</p>
      )}
    </div>
  );
};

export default DetalhesInput;
