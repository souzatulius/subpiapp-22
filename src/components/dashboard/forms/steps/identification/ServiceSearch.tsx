
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X } from 'lucide-react';

export interface ServiceSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredServicos: any[];
  onServiceSelect: (serviceId: string) => void;
  selectedServiceId: string;
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ServiceSearch: React.FC<ServiceSearchProps> = ({
  searchQuery,
  onSearchChange,
  filteredServicos,
  onServiceSelect,
  selectedServiceId,
  isPopoverOpen,
  setIsPopoverOpen
}) => {
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="relative rounded-xl overflow-hidden">
          <Input
            placeholder="Buscar serviço..."
            value={searchQuery}
            onChange={onSearchChange}
            className="pr-10 rounded-xl"
            onClick={() => setIsPopoverOpen(true)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search className="h-5 w-5" />
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="p-0 w-[300px] max-h-[300px] overflow-y-auto" side="bottom" align="start">
        {filteredServicos.length > 0 ? (
          <div className="grid grid-cols-1 gap-1 p-1">
            {filteredServicos.map(servico => (
              <Button
                key={servico.id}
                variant="ghost"
                className={`text-left justify-start h-auto py-2 px-3 rounded-lg ${
                  selectedServiceId === servico.id ? 'bg-orange-100 text-orange-800' : ''
                }`}
                onClick={() => {
                  onServiceSelect(servico.id);
                  setIsPopoverOpen(false);
                }}
              >
                {servico.descricao}
              </Button>
            ))}
          </div>
        ) : (
          <div className="p-3 text-center text-gray-500">
            Nenhum serviço encontrado
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ServiceSearch;
