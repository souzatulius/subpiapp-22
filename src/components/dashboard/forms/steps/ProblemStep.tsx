
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import TemaSelector from './identification/TemaSelector';
import ServiceSearch from './identification/ServiceSearch';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';
import DetalhesInput from './identification/DetalhesInput';

interface ProblemStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  problemas: any[];
  servicos: any[];
  filteredServicos: any[];
  serviceSearch: string;
  handleServiceSearch?: (value: string) => void;
  errors?: ValidationError[];
}

const ProblemStep: React.FC<ProblemStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  problemas,
  servicos,
  filteredServicos,
  serviceSearch,
  handleServiceSearch,
  errors = []
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const selectedProblem = problemas.find(p => p.id === formData.problema_id);
  const selectedService = servicos.find(s => s.id === formData.servico_id);

  const handleProblemClick = (problemId: string) => {
    // Se o problema já está selecionado, desmarque-o
    if (formData.problema_id === problemId) {
      handleSelectChange('problema_id', '');
    } else {
      handleSelectChange('problema_id', problemId);
    }
  };

  const handleServiceClick = (serviceId: string) => {
    // Se o serviço já está selecionado, desmarque-o
    if (formData.servico_id === serviceId) {
      handleSelectChange('servico_id', '');
    } else {
      handleSelectChange('servico_id', serviceId);
      handleSelectChange('nao_sabe_servico', false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          className={`font-medium text-lg block mb-2 ${hasFieldError('problema_id', errors) ? 'text-orange-500' : 'text-blue-950'}`}
        >
          Qual o assunto da solicitação? {hasFieldError('problema_id', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {problemas.map(problema => (
            <Button
              key={problema.id}
              type="button"
              variant={formData.problema_id === problema.id ? "default" : "outline"}
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-lg
                ${formData.problema_id === problema.id 
                  ? "bg-orange-500 text-white hover:bg-orange-600" 
                  : "hover:bg-orange-500 hover:text-white"
                }
              `}
              onClick={() => handleProblemClick(problema.id)}
            >
              {problema.icone && (
                <span className="text-2xl">
                  {problema.icone}
                </span>
              )}
              <span className="text-sm font-semibold">{problema.descricao}</span>
            </Button>
          ))}
        </div>
        {hasFieldError('problema_id', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('problema_id', errors)}</p>
        )}
      </div>
      
      {formData.problema_id && (
        <div className="animate-fadeIn">
          <Label 
            className={`font-medium text-lg block mb-2 ${
              hasFieldError('servico_id', errors) ? 'text-orange-500' : 'text-blue-950'
            }`}
          >
            Qual serviço relacionado ao tema? {hasFieldError('servico_id', errors) && <span className="text-orange-500">*</span>}
          </Label>
          
          {servicos.length > 0 ? (
            <>
              <div className="mb-4">
                <ServiceSearch 
                  searchQuery={serviceSearch}
                  onSearchChange={(e) => handleServiceSearch && handleServiceSearch(e.target.value)}
                  filteredServicos={filteredServicos}
                  onServiceSelect={handleServiceClick}
                  selectedServiceId={formData.servico_id}
                  isPopoverOpen={isPopoverOpen}
                  setIsPopoverOpen={setIsPopoverOpen}
                />
              </div>
              
              {formData.servico_id && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-3 animate-fadeIn">
                  <p className="font-medium text-blue-900">Serviço selecionado:</p>
                  <p className="text-blue-700">{selectedService?.descricao}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="checkbox"
                  id="nao_sabe_servico"
                  checked={formData.nao_sabe_servico}
                  onChange={(e) => handleSelectChange('nao_sabe_servico', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="nao_sabe_servico" className="text-sm text-gray-700">
                  Não sei o serviço específico
                </label>
              </div>
              
              {hasFieldError('servico_id', errors) && (
                <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('servico_id', errors)}</p>
              )}
            </>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500">Não há serviços cadastrados para este tema.</p>
              <input
                type="checkbox"
                id="nao_sabe_servico"
                checked={true}
                onChange={() => {}}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      <DetalhesInput 
        value={formData.detalhes_solicitacao} 
        onChange={handleChange}
        errors={errors}
      />
    </div>
  );
};

export default ProblemStep;
