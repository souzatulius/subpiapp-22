
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface TitleSectionProps {
  titulo: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedProblem?: any;
  selectedService?: any;
  selectedBairro?: any;
  errors?: ValidationError[];
}

const TitleSection: React.FC<TitleSectionProps> = ({
  titulo,
  handleChange,
  selectedProblem,
  selectedService,
  selectedBairro,
  errors = []
}) => {
  return (
    <div>
      <Label 
        htmlFor="titulo" 
        className={`text-lg font-medium block mb-2 ${hasFieldError('titulo', errors) ? 'text-orange-500 font-semibold' : 'text-blue-950'}`}
      >
        Título da Demanda {hasFieldError('titulo', errors) && <span className="text-orange-500">*</span>}
      </Label>
      <Input 
        id="titulo" 
        name="titulo" 
        value={titulo} 
        onChange={handleChange} 
        className={`rounded-xl ${hasFieldError('titulo', errors) ? 'border-orange-500' : ''}`}
        placeholder="Digite um título claro e conciso"
      />
      {hasFieldError('titulo', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('titulo', errors)}</p>
      )}
    </div>
  );
};

export default TitleSection;
