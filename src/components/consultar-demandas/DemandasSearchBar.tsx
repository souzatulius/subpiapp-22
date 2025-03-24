
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface DemandasSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DemandasSearchBar: React.FC<DemandasSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          type="search" 
          placeholder="Buscar demandas..." 
          className="pl-9" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
      </div>
      <Button variant="outline" className="md:w-auto flex items-center gap-2">
        <Filter className="h-4 w-4" />
        Filtros
      </Button>
    </div>
  );
};

export default DemandasSearchBar;
