
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError } from '@/lib/formValidationUtils';

interface RequestInfoStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: ValidationError[];
  handleSelectChange?: (name: string, value: string | boolean) => void;
}

const RequestInfoStep: React.FC<RequestInfoStepProps> = ({
  formData,
  handleChange,
  errors,
  handleSelectChange
}) => {
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <div className={hasError('detalhes_solicitacao') ? 'error' : ''}>
        <Label htmlFor="detalhes_solicitacao" className={hasError('detalhes_solicitacao') ? 'text-destructive' : ''}>
          O que está acontecendo? *
        </Label>
        <Textarea
          id="detalhes_solicitacao"
          name="detalhes_solicitacao"
          value={formData.detalhes_solicitacao || ''}
          onChange={handleChange}
          placeholder="Digite aqui..."
          className={`min-h-[150px] ${hasError('detalhes_solicitacao') ? 'border-red-500' : ''}`}
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-sm font-medium text-destructive">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>
    </div>
  );
};

export default RequestInfoStep;
