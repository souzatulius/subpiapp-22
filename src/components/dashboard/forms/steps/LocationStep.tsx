
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { ChevronDown, ChevronUp, MapPin, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import TemaSelector from './identification/TemaSelector';
import DetalhesInput from './identification/DetalhesInput';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';

interface LocationStepProps {
  formData: {
    problema_id: string;
    endereco: string;
    bairro_id: string;
    detalhes_solicitacao: string;
    servico_id: string;
    nao_sabe_servico: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  distritos: any[];
  selectedDistrito: string;
  setSelectedDistrito: (value: string) => void;
  filteredBairros: any[];
  errors: ValidationError[];
  problemas: any[];
  serviceSearch?: string;
  servicos?: any[];
  filteredServicos?: any[];
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
  serviceSearch = '',
  servicos = [],
  filteredServicos = [],
  handleServiceSearch
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showMoreDistritos, setShowMoreDistritos] = useState(false);
  const [showMoreBairros, setShowMoreBairros] = useState(false);
  
  const hasError = (field: string) => errors.some(error => error.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // When a district is selected, filter neighborhoods accordingly
  const handleDistritoSelect = (distritoId: string) => {
    // If clicking the same distrito, allow deselection
    if (selectedDistrito === distritoId) {
      setSelectedDistrito('');
      // Clear neighborhood selection
      if (formData.bairro_id) {
        handleSelectChange('bairro_id', '');
      }
      return;
    }
    
    setSelectedDistrito(distritoId);
    if (formData.bairro_id) {
      // Clear neighborhood selection if district changes
      const currentBairro = filteredBairros.find(b => b.id === formData.bairro_id);
      if (!currentBairro) {
        handleSelectChange('bairro_id', '');
      }
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    handleSelectChange('servico_id', serviceId);
    setIsPopoverOpen(false);
  };

  const handleDontKnowService = () => {
    handleSelectChange('nao_sabe_servico', true);
  };

  const handleBairroSelect = (bairroId: string) => {
    // If clicking the same bairro, allow deselection
    if (formData.bairro_id === bairroId) {
      handleSelectChange('bairro_id', '');
      return;
    }
    handleSelectChange('bairro_id', bairroId);
  };

  // Get the maximum number of districts to show (show 8 if not expanded)
  const visibleDistritos = showMoreDistritos ? distritos : distritos.slice(0, 8);
  
  // Get the maximum number of neighborhoods to show (show 8 if not expanded)
  const visibleBairros = showMoreBairros ? filteredBairros : filteredBairros.slice(0, 8);
  
  // Get the selected bairro details
  const selectedBairro = filteredBairros.find(bairro => bairro.id === formData.bairro_id);

  return (
    <div className="space-y-6">
      <div>
        <TemaSelector 
          problemas={problemas}
          selectedTemaId={formData.problema_id}
          handleSelectChange={(problemId) => handleSelectChange('problema_id', problemId)}
          errors={errors}
        />
      </div>

      {/* Two column layout for Distritos and Bairros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distritos */}
        <div>
          <Label className={`block mb-2 ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}>
            Distrito {hasError('bairro_id') && <span className="text-orange-500">*</span>}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {visibleDistritos.map(distrito => (
              <Button
                key={distrito.id}
                type="button"
                variant={selectedDistrito === distrito.id ? "default" : "outline"}
                className={`h-auto py-2 justify-start text-left ${
                  selectedDistrito === distrito.id ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""
                }`}
                onClick={() => handleDistritoSelect(distrito.id)}
              >
                {distrito.nome}
              </Button>
            ))}
          </div>
          
          {distritos.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreDistritos(!showMoreDistritos)}
              className="mt-2 text-gray-600"
            >
              {showMoreDistritos ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Ver mais distritos
                </>
              )}
            </Button>
          )}
          
          {hasError('distrito_id') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('distrito_id')}</p>
          )}
        </div>
        
        {/* Bairros (only show if distrito is selected) */}
        <div className={selectedDistrito ? "animate-fadeIn" : "hidden"}>
          <Label className={`block mb-2 ${hasError('bairro_id') ? 'text-orange-500 font-semibold' : ''}`}>
            Bairro {hasError('bairro_id') && <span className="text-orange-500">*</span>}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {visibleBairros.map(bairro => (
              <Button
                key={bairro.id}
                type="button"
                variant={formData.bairro_id === bairro.id ? "default" : "outline"}
                className={`h-auto py-2 justify-start text-left ${
                  formData.bairro_id === bairro.id ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""
                }`}
                onClick={() => handleBairroSelect(bairro.id)}
              >
                {bairro.nome}
              </Button>
            ))}
          </div>
          
          {filteredBairros.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreBairros(!showMoreBairros)}
              className="mt-2 text-gray-600"
            >
              {showMoreBairros ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Ver mais bairros
                </>
              )}
            </Button>
          )}
          
          {hasError('bairro_id') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('bairro_id')}</p>
          )}
        </div>
      </div>
      
      {/* Endereço (only show if bairro is selected) */}
      {formData.bairro_id && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="endereco" 
            className={`block mb-2 ${hasError('endereco') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Endereço {hasError('endereco') && <span className="text-orange-500">*</span>}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className={`pl-10 ${hasError('endereco') ? 'border-orange-500' : ''}`}
              placeholder={`Digite o endereço completo em ${selectedBairro?.nome || ''}`}
            />
          </div>
          {hasError('endereco') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('endereco')}</p>
          )}
        </div>
      )}

      <DetalhesInput
        value={formData.detalhes_solicitacao}
        handleChange={handleChange}
        errors={errors}
      />
    </div>
  );
};

export default LocationStep;
