
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import TemaSelector from './identification/TemaSelector';
import { Checkbox } from '@/components/ui/checkbox';
import DetalhesInput from './identification/DetalhesInput';

interface LocationStepProps {
  formData: {
    problema_id: string;
    bairro_id: string;
    detalhes_solicitacao: string;
    endereco: string;
    servico_id?: string;
    nao_sabe_servico?: boolean;
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
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const showServiceSection = formData.problema_id !== '';
  const showBairroSection = selectedDistrito !== '';
  const showEnderecoField = formData.bairro_id !== '';

  return (
    <div className="space-y-8">
      {/* Tema (Problema) Selector */}
      <TemaSelector
        problemas={problemas}
        selectedTemaId={formData.problema_id}
        handleSelectChange={(id) => handleSelectChange('problema_id', id)}
        errors={errors}
      />

      {/* Services Selection */}
      {showServiceSection && (
        <div className="space-y-4">
          <div>
            <Label className={`font-semibold ${hasError('servico_id') ? 'text-orange-500' : ''}`}>
              Selecione o serviço relacionado {formData.nao_sabe_servico ? '' : (hasError('servico_id') && <span className="text-orange-500">*</span>)}
            </Label>
            <div className="mt-2">
              <Input
                placeholder="Pesquisar serviço..."
                value={serviceSearch}
                onChange={(e) => handleServiceSearch(e.target.value)}
                disabled={formData.nao_sabe_servico || !formData.problema_id}
                className="mb-2"
              />
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                {filteredServicos.map(servico => (
                  <Button
                    key={servico.id}
                    type="button"
                    variant={formData.servico_id === servico.id ? "default" : "outline"}
                    className={`justify-start text-left h-auto py-2 ${
                      formData.servico_id === servico.id ? "ring-2 ring-[#003570]" : ""
                    } ${
                      hasError('servico_id') ? 'border-orange-500' : ''
                    }`}
                    onClick={() => handleSelectChange('servico_id', servico.id)}
                    disabled={formData.nao_sabe_servico}
                  >
                    {servico.descricao}
                  </Button>
                ))}
                {filteredServicos.length === 0 && serviceSearch && (
                  <p className="text-gray-500 text-sm py-2">Nenhum serviço encontrado para "{serviceSearch}"</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="nao_sabe_servico"
              checked={formData.nao_sabe_servico}
              onCheckedChange={(checked) => handleSelectChange('nao_sabe_servico', Boolean(checked))}
            />
            <label
              htmlFor="nao_sabe_servico"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Não sei o serviço específico
            </label>
          </div>
          {hasError('servico_id') && !formData.nao_sabe_servico && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('servico_id')}</p>
          )}
        </div>
      )}

      {/* Detalhes da Solicitação */}
      <DetalhesInput
        value={formData.detalhes_solicitacao}
        onChange={(e) => handleChange(e)}
        error={hasError('detalhes_solicitacao') ? getErrorMessage('detalhes_solicitacao') : ''}
      />

      {/* Distrito Selection */}
      <div className="space-y-4">
        <Label className={`font-semibold ${hasError('bairro_id') ? 'text-orange-500' : ''}`}>
          Selecione o Distrito {hasError('bairro_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex flex-wrap gap-2">
          {distritos.map(distrito => (
            <Button
              key={distrito.id}
              type="button"
              variant={selectedDistrito === distrito.id ? "default" : "outline"}
              className={`${selectedDistrito === distrito.id ? "ring-2 ring-[#003570]" : ""}`}
              onClick={() => {
                setSelectedDistrito(distrito.id);
                if (formData.bairro_id) {
                  handleSelectChange('bairro_id', '');
                }
              }}
            >
              {distrito.nome}
            </Button>
          ))}
        </div>
      </div>

      {/* Bairro Selection */}
      {showBairroSection && (
        <div className="animate-fadeIn space-y-4">
          <Label className={`font-semibold ${hasError('bairro_id') ? 'text-orange-500' : ''}`}>
            Selecione o Bairro {hasError('bairro_id') && <span className="text-orange-500">*</span>}
          </Label>
          <div className="flex flex-wrap gap-2">
            {filteredBairros.map(bairro => (
              <Button
                key={bairro.id}
                type="button"
                variant={formData.bairro_id === bairro.id ? "default" : "outline"}
                className={`${formData.bairro_id === bairro.id ? "ring-2 ring-[#003570]" : ""} ${
                  hasError('bairro_id') ? 'border-orange-500' : ''
                }`}
                onClick={() => handleSelectChange('bairro_id', bairro.id)}
              >
                {bairro.nome}
              </Button>
            ))}
          </div>
          {hasError('bairro_id') && (
            <p className="text-orange-500 text-sm">{getErrorMessage('bairro_id')}</p>
          )}
        </div>
      )}

      {/* Endereço Input */}
      {showEnderecoField && (
        <div className="animate-fadeIn">
          <Label htmlFor="endereco" className="font-semibold">Endereço</Label>
          <Input
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Digite o endereço completo"
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default LocationStep;
