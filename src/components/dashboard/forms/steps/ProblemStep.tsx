
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { Checkbox } from '@/components/ui/checkbox';
import { DemandFormData } from '@/hooks/demandForm/types';

interface ProblemStepProps {
  formData: DemandFormData;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [filteredProblems, setFilteredProblems] = useState(problemas);
  const [isServiceVisible, setIsServiceVisible] = useState(!!formData.problema_id);
  const [isDetailsVisible, setIsDetailsVisible] = useState(
    !!formData.servico_id || formData.nao_sabe_servico
  );
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = problemas.filter(p => 
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProblems(filtered);
    } else {
      setFilteredProblems(problemas);
    }
  }, [searchTerm, problemas]);

  useEffect(() => {
    // Show service section if a problem is selected
    setIsServiceVisible(!!formData.problema_id);
    
    // Show details section if a service is selected or "Não sei informar" is checked
    setIsDetailsVisible(!!formData.servico_id || formData.nao_sabe_servico);
  }, [formData.problema_id, formData.servico_id, formData.nao_sabe_servico]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleServiceSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceSearchTerm(e.target.value);
    if (handleServiceSearch) {
      handleServiceSearch(e.target.value);
    }
  };

  const handleProblemSelection = (id: string) => {
    handleSelectChange('problema_id', id);
  };

  const handleServiceSelection = (id: string) => {
    handleSelectChange('servico_id', id);
    handleSelectChange('nao_sabe_servico', false);
  };

  const handleDontKnowService = (checked: boolean) => {
    handleSelectChange('nao_sabe_servico', checked);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className={`block ${hasError('problema_id') ? 'text-orange-500 font-semibold' : ''}`}>
            Tema/Problema
          </Label>
          <div className="w-1/3">
            <Input
              placeholder="Buscar tema..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="py-1 px-2 h-8"
            />
          </div>
        </div>
        
        <RadioGroup
          value={formData.problema_id}
          onValueChange={handleProblemSelection}
          className="flex flex-col space-y-1"
        >
          {filteredProblems.length === 0 ? (
            <div className="text-gray-500 p-4 text-center">
              Nenhum tema encontrado
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <div key={problem.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={problem.id} id={`problem-${problem.id}`} />
                <Label htmlFor={`problem-${problem.id}`} className="cursor-pointer w-full">
                  {problem.descricao}
                </Label>
              </div>
            ))
          )}
        </RadioGroup>
        
        {hasError('problema_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('problema_id')}</p>
        )}
      </div>

      {isServiceVisible && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <Label className={`block ${hasError('servico_id') ? 'text-orange-500 font-semibold' : ''}`}>
              Serviço
            </Label>
            <div className="w-1/3">
              <Input
                placeholder="Buscar serviço..."
                value={serviceSearchTerm}
                onChange={handleServiceSearchChange}
                className="py-1 px-2 h-8"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nao-sei-servico" 
                checked={formData.nao_sabe_servico} 
                onCheckedChange={handleDontKnowService}
              />
              <label 
                htmlFor="nao-sei-servico" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Não sei informar o serviço
              </label>
            </div>
          </div>
          
          {!formData.nao_sabe_servico && (
            <RadioGroup
              value={formData.servico_id}
              onValueChange={handleServiceSelection}
              className="flex flex-col space-y-1"
            >
              {filteredServicos.length === 0 ? (
                <div className="text-gray-500 p-4 text-center">
                  Nenhum serviço encontrado para este tema
                </div>
              ) : (
                filteredServicos.map((servico) => (
                  <div key={servico.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={servico.id} id={`servico-${servico.id}`} />
                    <Label htmlFor={`servico-${servico.id}`} className="cursor-pointer w-full">
                      {servico.descricao}
                    </Label>
                  </div>
                ))
              )}
            </RadioGroup>
          )}
        </div>
      )}

      {isDetailsVisible && (
        <div className="border-t pt-4">
          <div className="mb-2">
            <Label className={`block ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}>
              Detalhes da Solicitação
            </Label>
          </div>
          
          <textarea
            name="detalhes_solicitacao"
            value={formData.detalhes_solicitacao}
            onChange={handleChange}
            placeholder="Descreva os detalhes da solicitação..."
            className={`w-full min-h-[150px] p-3 border rounded-lg ${
              hasError('detalhes_solicitacao') ? 'border-orange-500' : 'border-gray-300'
            }`}
          />
          
          {hasError('detalhes_solicitacao') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemStep;
