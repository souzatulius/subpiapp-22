
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { formatPhone } from '@/lib/formValidation';

interface RequesterInfoStepProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: ValidationError[];
}

const RequesterInfoStep: React.FC<RequesterInfoStepProps> = ({ 
  formData, 
  handleChange,
  errors = [] 
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    
    // Create a new event object with the formatted value
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(newEvent);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nome_solicitante">Nome do Solicitante</Label>
        <Input 
          id="nome_solicitante" 
          name="nome_solicitante" 
          value={formData.nome_solicitante} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefone_solicitante">Telefone</Label>
          <Input 
            id="telefone_solicitante" 
            name="telefone_solicitante" 
            value={formData.telefone_solicitante} 
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
        </div>
        
        <div>
          <Label htmlFor="email_solicitante">E-mail</Label>
          <Input 
            id="email_solicitante" 
            name="email_solicitante" 
            type="email" 
            value={formData.email_solicitante} 
            onChange={handleChange} 
            placeholder="exemplo@email.com"
          />
        </div>
      </div>
    </div>
  );
};

export default RequesterInfoStep;
