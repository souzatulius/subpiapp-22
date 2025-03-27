
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';
import { generateTitleSuggestion } from './utils';

interface TitleSectionProps {
  titulo: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedProblem?: any;
  selectedService?: any;
  selectedBairro?: any;
  errors?: ValidationError[];
  formData: any;
  problemas: any[];
  servicos: any[];
  filteredBairros: any[];
}

const TitleSection: React.FC<TitleSectionProps> = ({
  titulo,
  handleChange,
  selectedProblem,
  selectedService,
  selectedBairro,
  errors = [],
  formData,
  problemas,
  servicos,
  filteredBairros
}) => {
  const [suggestedTitle, setSuggestedTitle] = useState('');
  
  useEffect(() => {
    // Generate title suggestion whenever relevant form data changes
    const suggestion = generateTitleSuggestion(formData, problemas, servicos, filteredBairros);
    setSuggestedTitle(suggestion);
  }, [formData.problema_id, formData.servico_id, formData.bairro_id, formData.endereco, problemas, servicos, filteredBairros]);

  return (
    <div>
      <Label 
        htmlFor="titulo" 
        className={`block mb-2 ${hasFieldError('titulo', errors) ? 'text-orange-500 font-semibold' : ''}`}
      >
        Título da Demanda
      </Label>
      <Input 
        id="titulo" 
        name="titulo" 
        value={titulo} 
        onChange={handleChange} 
        className={`rounded-xl ${hasFieldError('titulo', errors) ? 'border-orange-500' : ''}`}
        placeholder={suggestedTitle || "Digite um título claro e conciso"}
      />
      {suggestedTitle && titulo.trim() === '' && (
        <p className="text-gray-500 text-sm mt-1">
          Sugestão: {suggestedTitle}
        </p>
      )}
      {hasFieldError('titulo', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('titulo', errors)}</p>
      )}
    </div>
  );
};

export default TitleSection;
