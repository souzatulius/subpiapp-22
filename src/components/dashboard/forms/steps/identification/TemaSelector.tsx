
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';
import { ValidationError } from '@/lib/formValidationUtils';
import ServiceTagSelector from '../ServiceTagSelector';

interface TemaSelectorProps {
  problemas: any[];
  servicos: any[];
  filteredServicos: any[];
  formData: {
    problema_id: string;
    servico_id: string;
    nao_sabe_servico: boolean;
  };
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSearch: (value: string) => void;
  serviceSearch: string;
  errors: ValidationError[];
  className?: string;
}

const TemaSelector: React.FC<TemaSelectorProps> = ({
  problemas,
  servicos,
  filteredServicos,
  formData,
  handleSelectChange,
  handleServiceSearch,
  serviceSearch,
  errors,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label 
          htmlFor="problema_id" 
          className={`form-question-title ${hasFieldError('problema_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          Tema {hasFieldError('problema_id', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Select
          value={formData.problema_id}
          onValueChange={(value) => handleSelectChange('problema_id', value)}
        >
          <SelectTrigger
            id="problema_id"
            className={`w-full bg-white border rounded-xl shadow-sm ${
              hasFieldError('problema_id', errors) ? 'border-orange-500' : 'border-gray-300'
            }`}
          >
            <SelectValue placeholder="Selecione o tema relacionado" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-xl border-gray-200">
            {problemas.map((problema) => (
              <SelectItem key={problema.id} value={problema.id} className="cursor-pointer">
                {problema.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFieldError('problema_id', errors) && (
          <p className="text-orange-500 text-sm mt-1">
            {getFieldErrorMessage('problema_id', errors)}
          </p>
        )}
      </div>

      {formData.problema_id && (
        <div>
          <div className="flex items-center mb-2">
            <Label 
              htmlFor="servico_id" 
              className="form-question-title"
            >
              Serviço
            </Label>
            <div className="flex items-center ml-4">
              <input
                type="checkbox"
                id="nao_sabe_servico"
                checked={formData.nao_sabe_servico}
                onChange={(e) => handleSelectChange('nao_sabe_servico', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="nao_sabe_servico" className="ml-2 text-sm text-gray-600">
                Não sei informar o serviço específico
              </label>
            </div>
          </div>
          
          {!formData.nao_sabe_servico && (
            <>
              <ServiceTagSelector
                services={filteredServicos}
                selectedServiceId={formData.servico_id}
                onServiceSelect={(id) => handleSelectChange('servico_id', id)}
                className="mt-2"
              />
              
              {hasFieldError('servico_id', errors) && (
                <p className="text-orange-500 text-sm mt-1">
                  {getFieldErrorMessage('servico_id', errors)}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TemaSelector;
