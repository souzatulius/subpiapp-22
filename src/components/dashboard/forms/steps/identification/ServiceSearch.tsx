
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';

export interface ServiceSearchProps {
  servicos: any[];
  filteredServicos: any[];
  selectedServico: string;
  naoSabeServico: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onServiceSelect: (serviceId: string) => void;
  onToggleNaoSabe: (checked: boolean) => void;
  errors: ValidationError[];
}

const ServiceSearch: React.FC<ServiceSearchProps> = ({
  servicos,
  filteredServicos,
  selectedServico,
  naoSabeServico,
  searchQuery,
  onSearchChange,
  onServiceSelect,
  onToggleNaoSabe,
  errors
}) => {
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Find the selected service
  const selectedServiceObj = servicos.find(s => s.id === selectedServico);

  // Handle outside click to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setShowResults(true);
  };

  // Handle service selection
  const handleSelectService = (serviceId: string) => {
    onServiceSelect(serviceId);
    setShowResults(false);
    if (naoSabeServico) {
      onToggleNaoSabe(false);
    }
  };

  // Handle removing selected service
  const handleRemoveService = () => {
    onServiceSelect('');
  };

  return (
    <div className="space-y-3">
      <Label 
        htmlFor="servico_id" 
        className={`form-question-title ${hasFieldError('servico_id', errors) ? 'text-orange-500 font-semibold' : ''}`}
      >
        Qual serviço está relacionado? {hasFieldError('servico_id', errors) && <span className="text-orange-500">*</span>}
      </Label>
      
      <div ref={searchRef} className="relative">
        {!selectedServiceObj && !naoSabeServico ? (
          <>
            <div className="relative">
              <Input
                type="text"
                placeholder="Pesquisar serviço..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowResults(true)}
                className={`pr-10 ${hasFieldError('servico_id', errors) ? 'border-orange-500' : ''}`}
                disabled={naoSabeServico}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {showResults && searchQuery && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredServicos.length > 0 ? (
                  filteredServicos.map(service => (
                    <Button
                      key={service.id}
                      variant="ghost"
                      className="w-full justify-start text-left px-3 py-2 text-sm hover:bg-orange-100"
                      onClick={() => handleSelectService(service.id)}
                    >
                      {service.descricao}
                    </Button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">Nenhum serviço encontrado</div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center bg-gray-100 p-2 rounded-xl">
            <span className="flex-1 text-gray-800">
              {selectedServiceObj?.descricao || (naoSabeServico ? "Serviço não especificado" : "")}
            </span>
            {!naoSabeServico && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveService}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
      
      {hasFieldError('servico_id', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('servico_id', errors)}</p>
      )}
    </div>
  );
};

export default ServiceSearch;
