
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';

interface RequestInfoStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
}

const RequestInfoStep: React.FC<RequestInfoStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors
}) => {
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <FormItem className={hasError('prioridade') ? 'error' : ''}>
        <FormLabel>Prioridade *</FormLabel>
        <Select
          value={formData.prioridade}
          onValueChange={(value) => handleSelectChange('prioridade', value)}
        >
          <FormControl>
            <SelectTrigger className={hasError('prioridade') ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
        {hasError('prioridade') && (
          <FormMessage>{getErrorMessage('prioridade')}</FormMessage>
        )}
      </FormItem>

      <FormItem className={hasError('prazo_resposta') ? 'error' : ''}>
        <FormLabel>Prazo de Resposta *</FormLabel>
        <FormControl>
          <Input
            type="date"
            name="prazo_resposta"
            value={formData.prazo_resposta}
            onChange={handleChange}
            className={hasError('prazo_resposta') ? 'border-red-500' : ''}
          />
        </FormControl>
        {hasError('prazo_resposta') && (
          <FormMessage>{getErrorMessage('prazo_resposta')}</FormMessage>
        )}
      </FormItem>

      <FormItem>
        <FormLabel>Nome do Solicitante</FormLabel>
        <FormControl>
          <Input
            name="nome_solicitante"
            value={formData.nome_solicitante || ''}
            onChange={handleChange}
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Telefone do Solicitante</FormLabel>
        <FormControl>
          <Input
            name="telefone_solicitante"
            value={formData.telefone_solicitante || ''}
            onChange={handleChange}
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Email do Solicitante</FormLabel>
        <FormControl>
          <Input
            type="email"
            name="email_solicitante"
            value={formData.email_solicitante || ''}
            onChange={handleChange}
          />
        </FormControl>
      </FormItem>

      {formData.origem_id === '1' && (
        <FormItem>
          <FormLabel>Veículo de Imprensa</FormLabel>
          <FormControl>
            <Input
              name="veiculo_imprensa"
              value={formData.veiculo_imprensa || ''}
              onChange={handleChange}
            />
          </FormControl>
        </FormItem>
      )}
    </div>
  );
};

export default RequestInfoStep;
