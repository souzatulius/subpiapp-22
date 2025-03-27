
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError } from '@/lib/formValidationUtils';

interface DetalhesInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: ValidationError[];
}

const DetalhesInput: React.FC<DetalhesInputProps> = ({ value, handleChange, errors }) => {
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor="detalhes_solicitacao" 
        className={`block font-bold ${hasError('detalhes_solicitacao') ? 'text-orange-500' : ''}`}
      >
        Fale um pouco sobre a solicitação ou cole o e-mail recebido
        {hasError('detalhes_solicitacao') && <span className="text-orange-500">*</span>}
      </Label>
      <Textarea
        id="detalhes_solicitacao"
        name="detalhes_solicitacao"
        value={value}
        onChange={handleChange}
        rows={5}
        placeholder="Digite aqui..."
        className={`min-h-[120px] ${hasError('detalhes_solicitacao') ? 'border-orange-500' : ''}`}
      />
      {hasError('detalhes_solicitacao') && (
        <p className="text-orange-500 text-sm">{getErrorMessage('detalhes_solicitacao')}</p>
      )}
    </div>
  );
};

export default DetalhesInput;
