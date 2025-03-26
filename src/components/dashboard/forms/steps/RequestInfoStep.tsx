
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError } from '@/lib/formValidationUtils';

interface RequestInfoStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: ValidationError[];
}

const RequestInfoStep: React.FC<RequestInfoStepProps> = ({
  formData,
  handleChange,
  errors
}) => {
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <FormItem className={hasError('detalhes_solicitacao') ? 'error' : ''}>
        <FormLabel>Detalhes da Solicitação *</FormLabel>
        <FormControl>
          <Textarea
            name="detalhes_solicitacao"
            value={formData.detalhes_solicitacao || ''}
            onChange={handleChange}
            placeholder="Descreva com detalhes a solicitação"
            className={`min-h-[150px] ${hasError('detalhes_solicitacao') ? 'border-red-500' : ''}`}
          />
        </FormControl>
        {hasError('detalhes_solicitacao') && (
          <FormMessage>{getErrorMessage('detalhes_solicitacao')}</FormMessage>
        )}
      </FormItem>
    </div>
  );
};

export default RequestInfoStep;
