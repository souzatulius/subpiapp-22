
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ServicoSelectorProps {
  selectedServicoId: string;
  servicos: any[];
  servicosLoading: boolean;
  onServicoChange: (value: string) => void;
}

const ServicoSelector: React.FC<ServicoSelectorProps> = ({
  selectedServicoId,
  servicos,
  servicosLoading,
  onServicoChange
}) => {
  const [serviceSearch, setServiceSearch] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Find the selected service
  const selectedService = selectedServicoId 
    ? servicos.find(s => s.id === selectedServicoId) 
    : null;
  
  const handleServiceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceSearch(e.target.value);
  };
  
  const handleServiceSelect = (serviceId: string) => {
    onServicoChange(serviceId);
    setServiceSearch('');
    setIsPopoverOpen(false);
  };
  
  const handleServiceRemove = () => {
    onServicoChange('');
  };
  
  // Filter services based on search term
  const filteredServicesBySearch = serviceSearch
    ? servicos.filter(service => 
        service.descricao.toLowerCase().includes(serviceSearch.toLowerCase())
      )
    : servicos;

  return (
    <div className="animate-fade-in">
      {selectedService ? (
        <div className="flex items-center">
          <Badge className="px-3 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center transition-colors duration-300">
            {selectedService.descricao}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0 ml-2 text-blue-700 hover:text-blue-900 hover:bg-transparent"
              onClick={handleServiceRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      ) : (
        <div className="relative">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1">
                <Search className="h-5 w-5 text-gray-400 ml-4 mr-2 flex-shrink-0" />
                <Input 
                  type="text" 
                  value={serviceSearch} 
                  onChange={handleServiceSearch} 
                  onClick={() => setIsPopoverOpen(true)}
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <Card className="border-0 shadow-none">
                <div className="max-h-60 overflow-y-auto">
                  {filteredServicesBySearch.length > 0 ? (
                    filteredServicesBySearch.map(service => (
                      <Button 
                        key={service.id} 
                        variant="ghost" 
                        className="w-full justify-start px-4 py-3 text-left hover:bg-blue-50 rounded-none transition-colors duration-300"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        {service.id === selectedServicoId && <Check className="mr-2 h-4 w-4 text-green-500" />}
                        {service.descricao}
                      </Button>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">Nenhum serviço encontrado</p>
                  )}
                </div>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {servicosLoading && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">Carregando serviços...</p>
      )}
    </div>
  );
};

export default ServicoSelector;
