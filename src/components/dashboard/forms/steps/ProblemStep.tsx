
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ValidationError } from '@/lib/formValidationUtils';
import { getProblemIcon } from '@/components/settings/problems/renderIcon';
import ServiceSearch from './identification/ServiceSearch';

interface ProblemStepProps {
  formData: {
    problema_id: string;
    servico_id: string;
    nao_sabe_servico?: boolean;
  };
  problemas: any[];
  servicos: any[];
  filteredServicos: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleServiceSearch?: (value: string) => void;
  errors?: ValidationError[];
}

const ProblemStep: React.FC<ProblemStepProps> = ({
  formData,
  problemas,
  servicos,
  filteredServicos,
  handleChange,
  handleSelectChange,
  handleServiceSearch,
  errors = []
}) => {
  const [serviceSearch, setServiceSearch] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const handleLocalServiceSearch = (value: string) => {
    setServiceSearch(value);
    if (handleServiceSearch) {
      handleServiceSearch(value);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    handleSelectChange('servico_id', serviceId);
    setServiceSearch(''); // Clear search after selection
    setIsPopoverOpen(false);
  };

  // Toggle problema selection - allows deselection
  const toggleProblem = (problemId: string) => {
    if (formData.problema_id === problemId) {
      handleSelectChange('problema_id', '');
    } else {
      handleSelectChange('problema_id', problemId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="problema_id" 
          className={`text-lg font-medium block mb-2 ${hasError('problema_id') ? 'text-orange-500 font-semibold' : 'text-blue-950'}`}
        >
          Qual é o tema do problema? {hasError('problema_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {problemas.map(problema => (
            <Button 
              key={problema.id} 
              type="button" 
              variant={formData.problema_id === problema.id ? "default" : "outline"} 
              className={`h-auto py-3 px-2 flex flex-col items-center justify-center gap-2 selection-button ${
                formData.problema_id === problema.id ? "bg-orange-500 text-white" : ""
              } ${
                hasError('problema_id') ? 'border-orange-500' : ''
              } hover:bg-orange-500 hover:text-white rounded-xl`} 
              onClick={() => toggleProblem(problema.id)}
            >
              {getProblemIcon(problema)}
              <span className="text-sm font-semibold text-center">{problema.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('problema_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('problema_id')}</p>
        )}
      </div>
      
      {formData.problema_id && (
        <div className="animate-fadeIn space-y-4">
          <ServiceSearch
            servicos={servicos}
            filteredServicos={filteredServicos}
            selectedServico={formData.servico_id}
            naoSabeServico={formData.nao_sabe_servico || false}
            searchQuery={serviceSearch}
            onSearchChange={handleLocalServiceSearch}
            onServiceSelect={handleServiceSelect}
            onToggleNaoSabe={(checked) => handleSelectChange('nao_sabe_servico', checked)}
            errors={errors}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="nao-sabe-servico" 
              checked={formData.nao_sabe_servico} 
              onCheckedChange={(checked) => handleSelectChange('nao_sabe_servico', Boolean(checked))}
            />
            <Label htmlFor="nao-sabe-servico" className="text-sm cursor-pointer">
              Não sei qual serviço selecionar
            </Label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemStep;
