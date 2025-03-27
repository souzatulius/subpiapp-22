
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ValidationError } from '@/lib/formValidationUtils';
import { Search, X, ChevronDown } from 'lucide-react';
import { hasFieldError, getFieldErrorMessage } from './ValidationUtils';

interface ServiceSearchProps {
  servicos: any[];
  filteredServicos: any[];
  selectedServico: string;
  naoSabeServico: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onServiceSelect: (serviceId: string) => void;
  onToggleNaoSabe: (checked: boolean) => void;
  errors?: ValidationError[];
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
  errors = []
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  
  const selectedServiceObj = servicos.find(s => s.id === selectedServico);
  
  return (
    <div className="space-y-3">
      <Label 
        htmlFor="servico_id" 
        className={`block text-base font-medium ${hasFieldError('servico_id', errors) ? 'text-orange-500' : ''}`}
      >
        Serviço {hasFieldError('servico_id', errors) && <span className="text-orange-500">*</span>}
      </Label>
      
      {selectedServiceObj ? (
        <div className="flex items-center">
          <Badge className="px-3 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center">
            {selectedServiceObj.descricao}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0 ml-2 text-blue-700 hover:text-blue-900 hover:bg-transparent"
              onClick={() => onServiceSelect('')}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      ) : (
        <div className="relative">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-subpi-blue focus-within:ring-offset-1">
                <Search className="h-5 w-5 text-gray-400 ml-4 mr-2 flex-shrink-0" />
                <Input 
                  type="text" 
                  name="serviceSearch" 
                  value={searchQuery} 
                  onChange={(e) => onSearchChange(e.target.value)} 
                  onClick={() => setIsPopoverOpen(true)}
                  className={`flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${hasFieldError('servico_id', errors) ? 'placeholder-orange-300' : ''}`} 
                  placeholder="Pesquisar serviço" 
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  className="h-full px-4 border-l border-gray-200"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                >
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[calc(100%-2rem)] p-0 max-w-none bg-white rounded-xl shadow-lg border border-gray-200" 
              align="center"
              sideOffset={5}
            >
              <div className="max-h-60 overflow-y-auto">
                {filteredServicos.length > 0 ? (
                  filteredServicos.map(service => (
                    <Button 
                      key={service.id} 
                      variant="ghost" 
                      className="w-full justify-start px-4 py-3 text-left hover:bg-blue-50 rounded-none"
                      onClick={() => {
                        onServiceSelect(service.id);
                        setIsPopoverOpen(false);
                      }}
                    >
                      {service.descricao}
                    </Button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500">Nenhum serviço encontrado</p>
                )}
                
                <div className="border-t border-gray-200 my-1"></div>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 text-left text-orange-600 hover:bg-orange-50 hover:text-orange-700 rounded-none"
                  onClick={() => {
                    onToggleNaoSabe(!naoSabeServico);
                    setIsPopoverOpen(false);
                  }}
                >
                  Não sei informar o serviço
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {hasFieldError('servico_id', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('servico_id', errors)}</p>
      )}

      {!selectedServiceObj && (
        <div className="mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm" 
            className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 p-0 h-auto"
            onClick={() => onToggleNaoSabe(!naoSabeServico)}
          >
            Não sei o serviço específico
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSearch;
