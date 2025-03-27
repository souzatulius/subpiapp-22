
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError } from '@/lib/formValidationUtils';

interface DetalhesInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: ValidationError[];
}

const DetalhesInput: React.FC<DetalhesInputProps> = ({
  value,
  handleChange,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="mt-6">
      <label htmlFor="detalhes_solicitacao" className={`block mb-2 ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}>
        Detalhes da Solicitação {hasError('detalhes_solicitacao') && <span className="text-orange-500">*</span>}
      </label>
      <Textarea
        id="detalhes_solicitacao"
        name="detalhes_solicitacao"
        value={value}
        onChange={handleChange}
        rows={5}
        className={hasError('detalhes_solicitacao') ? 'border-orange-500' : ''}
        placeholder="Digite aqui..."
      />
      {hasError('detalhes_solicitacao') && (
        <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
      )}
    </div>
  );
};

export default DetalhesInput;
