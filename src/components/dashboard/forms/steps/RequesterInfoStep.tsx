
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';

interface RequesterInfoStepProps {
  formData: {
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
    veiculo_imprensa: string;
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

  // Handle phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Keep only digits
    
    if (value.length > 11) {
      value = value.slice(0, 11); // Limit to 11 digits (with area code)
    }
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (value.length > 0) {
      value = `(${value.slice(0, 2)}${value.length > 2 ? ') ' : ''}${value.slice(2, value.length > 10 ? 7 : 6)}${value.length > (value.length > 10 ? 7 : 6) ? '-' : ''}${value.slice(value.length > 10 ? 7 : 6)}`;
    }
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'telefone_solicitante',
        value
      }
    };
    
    handleChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nome_solicitante" className={`block ${hasError('nome_solicitante') ? 'text-orange-500 font-semibold' : ''}`}>
          Nome do Solicitante
        </Label>
        <Input 
          id="nome_solicitante" 
          name="nome_solicitante" 
          value={formData.nome_solicitante} 
          onChange={handleChange} 
          className={hasError('nome_solicitante') ? 'border-orange-500' : ''}
        />
        {hasError('nome_solicitante') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('nome_solicitante')}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefone_solicitante" className={`block ${hasError('telefone_solicitante') ? 'text-orange-500 font-semibold' : ''}`}>
            Telefone
          </Label>
          <Input 
            id="telefone_solicitante" 
            name="telefone_solicitante" 
            value={formData.telefone_solicitante} 
            onChange={handlePhoneChange} 
            placeholder="(00) 00000-0000"
            className={hasError('telefone_solicitante') ? 'border-orange-500' : ''}
          />
          {hasError('telefone_solicitante') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('telefone_solicitante')}</p>}
        </div>

        <div>
          <Label htmlFor="email_solicitante" className={`block ${hasError('email_solicitante') ? 'text-orange-500 font-semibold' : ''}`}>
            Email
          </Label>
          <Input 
            id="email_solicitante" 
            name="email_solicitante" 
            type="email"
            value={formData.email_solicitante} 
            onChange={handleChange} 
            placeholder="email@exemplo.com"
            className={hasError('email_solicitante') ? 'border-orange-500' : ''}
          />
          {hasError('email_solicitante') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('email_solicitante')}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="veiculo_imprensa" className={`block ${hasError('veiculo_imprensa') ? 'text-orange-500 font-semibold' : ''}`}>
          Veículo de Imprensa
        </Label>
        <Input 
          id="veiculo_imprensa" 
          name="veiculo_imprensa" 
          value={formData.veiculo_imprensa} 
          onChange={handleChange} 
          className={hasError('veiculo_imprensa') ? 'border-orange-500' : ''}
        />
        {hasError('veiculo_imprensa') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('veiculo_imprensa')}</p>}
      </div>
    </div>
  );
};

export default RequesterInfoStep;
