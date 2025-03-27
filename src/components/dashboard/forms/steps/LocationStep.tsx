
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';
import TemaSelector from './identification/TemaSelector';
import DetalhesInput from './identification/DetalhesInput';
import ServiceSearch from './identification/ServiceSearch';

interface LocationStepProps {
  formData: {
    problema_id: string;
    detalhes_solicitacao: string;
    bairro_id: string;
    endereco: string;
    nao_sabe_servico: boolean;
    servico_id: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  filteredBairros: any[];
  errors: ValidationError[];
  problemas: any[];
  servicos?: any[];
  filteredServicos?: any[];
  serviceSearch?: string;
  handleServiceSearch?: (value: string) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  distritos,
  selectedDistrito,
  setSelectedDistrito,
  filteredBairros,
  errors,
  problemas,
  servicos = [],
  filteredServicos = [],
  serviceSearch = '',
  handleServiceSearch = () => {}
}) => {
  // Allow deselection of district
  const handleDistrictSelect = (districtId: string) => {
    if (selectedDistrito === districtId) {
      setSelectedDistrito(''); // Deselect if already selected
      handleSelectChange('bairro_id', ''); // Also clear neighborhood selection
    } else {
      setSelectedDistrito(districtId);
      handleSelectChange('bairro_id', ''); // Reset neighborhood when changing district
    }
  };

  // Allow deselection of neighborhood
  const handleNeighborhoodSelect = (neighborhoodId: string) => {
    if (formData.bairro_id === neighborhoodId) {
      handleSelectChange('bairro_id', ''); // Deselect if already selected
    } else {
      handleSelectChange('bairro_id', neighborhoodId);
    }
  };

  return (
    <div className="space-y-6">
      <TemaSelector 
        problemas={problemas}
        selectedProblemId={formData.problema_id}
        onChange={(problemId) => handleSelectChange('problema_id', problemId)}
        errors={errors}
      />

      {formData.problema_id && servicos.length > 0 && (
        <div className="animate-fadeIn">
          <ServiceSearch
            servicos={servicos}
            filteredServicos={filteredServicos}
            selectedServico={formData.servico_id}
            naoSabeServico={formData.nao_sabe_servico}
            searchQuery={serviceSearch}
            onSearchChange={handleServiceSearch}
            onServiceSelect={(id) => handleSelectChange('servico_id', id)}
            onToggleNaoSabe={(checked) => handleSelectChange('nao_sabe_servico', checked)}
            errors={errors}
          />
        </div>
      )}

      <DetalhesInput 
        value={formData.detalhes_solicitacao}
        onChange={handleChange}
        errors={errors}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label 
            htmlFor="distrito_id" 
            className={`block text-base font-medium mb-2 ${hasFieldError('distrito_id', errors) ? 'text-orange-500' : ''}`}
          >
            Distrito
          </Label>
          <Select 
            value={selectedDistrito} 
            onValueChange={handleDistrictSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o distrito" />
            </SelectTrigger>
            <SelectContent>
              {distritos.map(distrito => (
                <SelectItem key={distrito.id} value={distrito.id}>
                  {distrito.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label 
            htmlFor="bairro_id" 
            className={`block text-base font-medium mb-2 ${hasFieldError('bairro_id', errors) ? 'text-orange-500' : ''}`}
          >
            Bairro {hasFieldError('bairro_id', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <Select 
            value={formData.bairro_id} 
            onValueChange={handleNeighborhoodSelect} 
            disabled={!selectedDistrito || filteredBairros.length === 0}
          >
            <SelectTrigger className={hasFieldError('bairro_id', errors) ? 'border-orange-500' : ''}>
              <SelectValue placeholder="Selecione o bairro" />
            </SelectTrigger>
            <SelectContent>
              {filteredBairros.map(bairro => (
                <SelectItem key={bairro.id} value={bairro.id}>
                  {bairro.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFieldError('bairro_id', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('bairro_id', errors)}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="endereco" className="block text-base font-medium mb-2">
          Endereço
        </Label>
        <Input
          id="endereco"
          name="endereco"
          value={formData.endereco || ''}
          onChange={handleChange}
          placeholder="Ex: Rua ABC, número 123"
        />
      </div>
    </div>
  );
};

export default LocationStep;
