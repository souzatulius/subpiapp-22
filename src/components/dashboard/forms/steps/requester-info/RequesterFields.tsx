
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
          className="block text-base font-medium mb-2"
        >
          Nome do Solicitante
        </Label>
        <Input
          id="nome_solicitante"
          name="nome_solicitante"
          value={formData.nome_solicitante || ''}
          onChange={handleChange}
          placeholder=""
          className="rounded-xl"
        />
      </div>
      
      <div>
        <Label 
          htmlFor="telefone_solicitante" 
          className="block text-base font-medium mb-2"
        >
          Telefone
        </Label>
        <Input
          id="telefone_solicitante"
          name="telefone_solicitante"
          value={formData.telefone_solicitante || ''}
          onChange={handleChange}
          placeholder="(11) 98765-4321"
          className="rounded-xl"
        />
      </div>
      
      <div>
        <Label 
          htmlFor="email_solicitante" 
          className="block text-base font-medium mb-2"
        >
          E-mail
        </Label>
        <Input
          id="email_solicitante"
          name="email_solicitante"
          type="email"
          value={formData.email_solicitante || ''}
          onChange={handleChange}
          placeholder="email@exemplo.com"
          className="rounded-xl"
        />
      </div>
    </div>
  );
};

export default RequesterFields;
