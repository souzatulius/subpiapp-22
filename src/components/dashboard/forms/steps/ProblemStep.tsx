
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import ServiceSearch from './identification/ServiceSearch';
import TemaSelector from './identification/TemaSelector';
import { Button } from '@/components/ui/button';

interface ProblemStepProps {
  formData: {
    problema_id: string;
    servico_id: string;
    nao_sabe_servico?: boolean;
    coordenacao_id?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  areasCoord: any[];
  problemas: any[];
  serviceSearch: string;
  servicos?: any[];
  filteredServicos?: any[];
  handleServiceSearch?: (value: string) => void;
  errors: ValidationError[];
}

const ProblemStep: React.FC<ProblemStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  areasCoord,
  problemas,
  serviceSearch,
  servicos = [],
  filteredServicos = [],
  handleServiceSearch,
  errors
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const [filteredProblemas, setFilteredProblemas] = useState(problemas);

  // Filter problemas based on selected coordenacao
  useEffect(() => {
    if (formData.coordenacao_id) {
      const filtered = problemas.filter(problema => 
        problema.coordenacao_id === formData.coordenacao_id
      );
      setFilteredProblemas(filtered);
    } else {
      setFilteredProblemas(problemas);
    }
  }, [formData.coordenacao_id, problemas]);

  return (
    <div className="space-y-6">
      {/* Coordenação (novo campo) */}
      <div className="space-y-2">
        <Label 
          htmlFor="coordenacao_id" 
          className={`block text-sm font-medium ${hasError('coordenacao_id') ? 'text-orange-500' : 'text-gray-700'}`}
        >
          Coordenação
        </Label>
        <Select
          value={formData.coordenacao_id || ''}
          onValueChange={(value) => handleSelectChange('coordenacao_id', value)}
        >
          <SelectTrigger 
            className={`w-full ${hasError('coordenacao_id') ? 'border-orange-500 ring-1 ring-orange-500' : ''}`}
            id="coordenacao_id"
          >
            <SelectValue placeholder="Selecione uma coordenação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as coordenações</SelectItem>
            {areasCoord.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError('coordenacao_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('coordenacao_id')}</p>
        )}
      </div>

      {/* Tema da demanda */}
      <div className="space-y-2">
        <TemaSelector
          selectedTema={formData.problema_id}
          onSelectTema={(temaId) => handleSelectChange('problema_id', temaId)}
          temas={filteredProblemas}
          hasError={hasError('problema_id')}
          errorMessage={getErrorMessage('problema_id')}
        />
      </div>

      {/* Serviço relacionado */}
      <div className="space-y-2">
        <ServiceSearch
          selectedServico={formData.servico_id}
          onSelectServico={(servicoId) => handleSelectChange('servico_id', servicoId)}
          onToggleNaoSabeServico={(value) => handleSelectChange('nao_sabe_servico', value)}
          naoSabeServico={formData.nao_sabe_servico}
          serviceSearch={serviceSearch}
          onServiceSearchChange={handleServiceSearch}
          servicos={filteredServicos}
          hasError={hasError('servico_id')}
          errorMessage={getErrorMessage('servico_id')}
          disabled={!formData.problema_id}
        />
      </div>
    </div>
  );
};

export default ProblemStep;
