
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';

interface RequesterInfoStepProps {
  formData: {
    origem_id: string;
    tipo_midia_id: string;
    veiculo_imprensa: string;
    nome_solicitante: string;
    telefone_solicitante: string;
    email_solicitante: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
  tiposMidia: any[];
  origens: any[];
}

const RequesterInfoStep: React.FC<RequesterInfoStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors,
  tiposMidia,
  origens
}) => {
  // Check if the origin requires media type field
  const selectedOrigin = origens.find(o => o.id === formData.origem_id);
  const requiresMediaType = selectedOrigin && ["Imprensa", "SMSUB", "SECOM"].includes(selectedOrigin.descricao);

  return (
    <div className="space-y-6">
      {requiresMediaType && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="tipo_midia_id" 
            className={`block text-base font-medium mb-2 ${hasFieldError('tipo_midia_id', errors) ? 'text-orange-500' : ''}`}
          >
            Tipo de Mídia {hasFieldError('tipo_midia_id', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Select 
            value={formData.tipo_midia_id} 
            onValueChange={(value) => handleSelectChange('tipo_midia_id', value)}
          >
            <SelectTrigger className={hasFieldError('tipo_midia_id', errors) ? 'border-orange-500' : ''}>
              <SelectValue placeholder="Selecione o tipo de mídia" />
            </SelectTrigger>
            <SelectContent>
              {tiposMidia.map(tipo => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFieldError('tipo_midia_id', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('tipo_midia_id', errors)}</p>
          )}
        </div>
      )}

      {requiresMediaType && formData.tipo_midia_id && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="veiculo_imprensa" 
            className={`block text-base font-medium mb-2 ${hasFieldError('veiculo_imprensa', errors) ? 'text-orange-500' : ''}`}
          >
            Veículo de Imprensa {hasFieldError('veiculo_imprensa', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Input
            id="veiculo_imprensa"
            name="veiculo_imprensa"
            value={formData.veiculo_imprensa || ''}
            onChange={handleChange}
            placeholder="Nome do veículo de imprensa"
            className={hasFieldError('veiculo_imprensa', errors) ? 'border-orange-500' : ''}
          />
          {hasFieldError('veiculo_imprensa', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('veiculo_imprensa', errors)}</p>
          )}
        </div>
      )}

      <div>
        <Label 
          htmlFor="nome_solicitante" 
          className={`block text-base font-medium mb-2 ${hasFieldError('nome_solicitante', errors) ? 'text-orange-500' : ''}`}
        >
          Nome do Solicitante {hasFieldError('nome_solicitante', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <Input
          id="nome_solicitante"
          name="nome_solicitante"
          value={formData.nome_solicitante || ''}
          onChange={handleChange}
          placeholder="Nome completo do solicitante"
          className={hasFieldError('nome_solicitante', errors) ? 'border-orange-500' : ''}
        />
        {hasFieldError('nome_solicitante', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('nome_solicitante', errors)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label 
            htmlFor="telefone_solicitante" 
            className={`block text-base font-medium mb-2 ${hasFieldError('telefone_solicitante', errors) ? 'text-orange-500' : ''}`}
          >
            Telefone {hasFieldError('telefone_solicitante', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Input
            id="telefone_solicitante"
            name="telefone_solicitante"
            value={formData.telefone_solicitante || ''}
            onChange={handleChange}
            placeholder="(11) 98765-4321"
            className={hasFieldError('telefone_solicitante', errors) ? 'border-orange-500' : ''}
          />
          {hasFieldError('telefone_solicitante', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('telefone_solicitante', errors)}</p>
          )}
        </div>
        
        <div>
          <Label 
            htmlFor="email_solicitante" 
            className={`block text-base font-medium mb-2 ${hasFieldError('email_solicitante', errors) ? 'text-orange-500' : ''}`}
          >
            E-mail {hasFieldError('email_solicitante', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Input
            id="email_solicitante"
            name="email_solicitante"
            type="email"
            value={formData.email_solicitante || ''}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            className={hasFieldError('email_solicitante', errors) ? 'border-orange-500' : ''}
          />
          {hasFieldError('email_solicitante', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('email_solicitante', errors)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequesterInfoStep;
