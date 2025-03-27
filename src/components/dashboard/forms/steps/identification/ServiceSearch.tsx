
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface ServiceSearchProps {
  selectedServico: string;
  naoSabeServico: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onServiceSelect: (serviceId: string) => void;
  onToggleNaoSabe: (checked: boolean) => void;
  errors?: ValidationError[];
  servicos: any[];
  filteredServicos: any[];
}

const ServiceSearch: React.FC<ServiceSearchProps> = ({
  selectedServico,
  naoSabeServico,
  searchQuery,
  onSearchChange,
  onServiceSelect,
  onToggleNaoSabe,
  errors = [],
  servicos,
  filteredServicos,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedService = servicos.find(s => s.id === selectedServico);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setIsPopoverOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setIsPopoverOpen(true);
  };

  const handleServiceClick = (serviceId: string) => {
    onServiceSelect(serviceId);
    setIsPopoverOpen(false);
  };

  const clearSelection = () => {
    onServiceSelect('');
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <Label 
        htmlFor="servico_id" 
        className={`text-lg font-medium block mb-2 ${hasFieldError('servico_id', errors) ? 'text-orange-500 font-semibold' : 'text-blue-950'}`}
      >
        Serviço {hasFieldError('servico_id', errors) && !naoSabeServico && <span className="text-orange-500">*</span>}
      </Label>
      
      {selectedServico && selectedService ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-orange-100 text-orange-800 p-3 rounded-xl border border-orange-200">
            <div className="font-medium">{selectedService.descricao}</div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={clearSelection}
            className="flex-shrink-0 rounded-xl"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative" ref={popoverRef}>
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              id="serviceSearch"
              name="serviceSearch"
              placeholder="Pesquisar serviço..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={`pl-10 rounded-xl ${hasFieldError('servico_id', errors) && !naoSabeServico ? 'border-orange-500' : ''}`}
              disabled={naoSabeServico}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          {isPopoverOpen && filteredServicos.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {filteredServicos.map(servico => (
                <button
                  key={servico.id}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 focus:bg-orange-50 focus:outline-none"
                  onClick={() => handleServiceClick(servico.id)}
                >
                  {servico.descricao}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {hasFieldError('servico_id', errors) && !naoSabeServico && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('servico_id', errors)}</p>
      )}
    </div>
  );
};

export default ServiceSearch;
