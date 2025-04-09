
import React from 'react';
import { Search, Plus, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ESICSearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  placeholder?: string;
}

const ESICSearchHeader: React.FC<ESICSearchHeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onCreateClick,
  placeholder = "Buscar processos por assunto, protocolo, solicitante..." 
}) => {
  return (
    <div className="flex gap-4 items-center w-full mb-6">
      <div className="relative flex-1 bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 py-2.5 w-full border-0 focus:ring-0 focus:border-0"
        />
      </div>
      
      <Button 
        onClick={onCreateClick}
        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
      >
        <Plus className="h-4 w-4" />
        Novo Processo
      </Button>
    </div>
  );
};

export default ESICSearchHeader;
