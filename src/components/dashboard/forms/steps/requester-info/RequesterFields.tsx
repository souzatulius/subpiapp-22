
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface RequesterFieldsProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationError[];
  inlineDisplay?: boolean;
}

const RequesterFields: React.FC<RequesterFieldsProps> = ({
  formData,
  handleChange,
  errors,
  inlineDisplay = false
}) => {
  const layoutClass = inlineDisplay ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-4";

  return (
    <div className={`animate-fadeIn ${layoutClass}`}>
      <div>
        <Label 
          htmlFor="nome_solicitante" 
          className={`block text-base font-medium mb-2 ${hasFieldError('nome_solicitante', errors) ? 'text-orange-500' : ''}`}
        >
          Nome do Solicitante {hasFieldError('nome_solicitante', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="nome_solicitante"
          name="nome_solicitante"
          value={formData.nome_solicitante || ''}
          onChange={handleChange}
          placeholder=""
          className={hasFieldError('nome_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('nome_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('nome_solicitante', errors)}</p>
        )}
      </div>
      
      <div>
        <Label 
          htmlFor="telefone_solicitante" 
          className={`block text-base font-medium mb-2 ${hasFieldError('telefone_solicitante', errors) ? 'text-orange-500' : ''}`}
        >
          Telefone {hasFieldError('telefone_solicitante', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="telefone_solicitante"
          name="telefone_solicitante"
          value={formData.telefone_solicitante || ''}
          onChange={handleChange}
          placeholder="(11) 98765-4321"
          className={hasFieldError('telefone_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('telefone_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('telefone_solicitante', errors)}</p>
        )}
      </div>
      
      <div>
        <Label 
          htmlFor="email_solicitante" 
          className={`block text-base font-medium mb-2 ${hasFieldError('email_solicitante', errors) ? 'text-orange-500' : ''}`}
        >
          E-mail {hasFieldError('email_solicitante', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="email_solicitante"
          name="email_solicitante"
          type="email"
          value={formData.email_solicitante || ''}
          onChange={handleChange}
          placeholder="email@exemplo.com"
          className={hasFieldError('email_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('email_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('email_solicitante', errors)}</p>
        )}
      </div>
    </div>
  );
};

export default RequesterFields;
