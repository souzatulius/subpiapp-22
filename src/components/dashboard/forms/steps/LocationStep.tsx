
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';
import ProblemStep from './ProblemStep';

interface LocationStepProps {
  formData: {
    problema_id: string;
    servico_id: string;
    nao_sabe_servico?: boolean;
    bairro_id: string;
    endereco: string;
  };
  problemas: any[];
  servicos: any[];
  filteredServicos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  distritos: any[];
  filteredBairros: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  serviceSearch?: string;
  handleServiceSearch?: (value: string) => void;
  areasCoord?: any[];
  errors?: ValidationError[];
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  problemas,
  servicos,
  filteredServicos,
  selectedDistrito,
  setSelectedDistrito,
  distritos,
  filteredBairros,
  handleChange,
  handleSelectChange,
  serviceSearch = '',
  handleServiceSearch,
  areasCoord = [],
  errors = []
}) => {
  // Show address field only if bairro is selected
  const showAddressField = formData.bairro_id !== '';
  
  // Only show distrito selection after problem and service are selected
  const showDistritoSelection = 
    formData.problema_id !== '' && 
    (formData.servico_id !== '' || formData.nao_sabe_servico === true);

  return (
    <div className="space-y-6">
      <ProblemStep
        formData={{
          problema_id: formData.problema_id,
          servico_id: formData.servico_id,
          nao_sabe_servico: formData.nao_sabe_servico
        }}
        problemas={problemas}
        servicos={servicos}
        filteredServicos={filteredServicos}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleServiceSearch={handleServiceSearch}
        serviceSearch={serviceSearch}
        areasCoord={areasCoord}
        errors={errors}
      />

      {showDistritoSelection && (
        <div className="animate-fadeIn">
          <Label 
            className={`form-question-title ${hasFieldError('distrito', errors) ? 'text-orange-500 font-semibold' : ''}`}
          >
            Distrito {hasFieldError('distrito', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <div className="flex flex-wrap gap-2">
            {distritos.map(distrito => (
              <Button 
                key={distrito.id} 
                type="button" 
                variant={selectedDistrito === distrito.id ? "default" : "outline"} 
                className={`selection-button ${selectedDistrito === distrito.id ? "bg-orange-500 text-white" : ""}`}
                onClick={() => setSelectedDistrito(distrito.id)}
              >
                {distrito.nome}
              </Button>
            ))}
          </div>
          {hasFieldError('distrito', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('distrito', errors)}</p>
          )}
        </div>
      )}
      
      {selectedDistrito && filteredBairros.length > 0 && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="bairro_id" 
            className={`form-question-title ${hasFieldError('bairro_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
          >
            Bairro {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <div className="flex flex-wrap gap-2">
            {filteredBairros.map(bairro => (
              <Button 
                key={bairro.id} 
                type="button" 
                variant={formData.bairro_id === bairro.id ? "default" : "outline"} 
                className={`selection-button ${formData.bairro_id === bairro.id ? "bg-orange-500 text-white" : ""}`}
                onClick={() => handleSelectChange('bairro_id', bairro.id)}
              >
                {bairro.nome}
              </Button>
            ))}
          </div>
          {hasFieldError('bairro_id', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('bairro_id', errors)}</p>
          )}
        </div>
      )}
      
      {showAddressField && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="endereco" 
            className={`form-question-title ${hasFieldError('endereco', errors) ? 'text-orange-500 font-semibold' : ''}`}
          >
            Endereço {hasFieldError('endereco', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Input
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Ex: Av. São João, 473"
            className={hasFieldError('endereco', errors) ? 'border-orange-500' : ''}
          />
          {hasFieldError('endereco', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('endereco', errors)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationStep;
