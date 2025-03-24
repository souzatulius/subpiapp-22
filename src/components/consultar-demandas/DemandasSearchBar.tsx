
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DemandasSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DemandasSearchBar: React.FC<DemandasSearchBarProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar demandas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full bg-white"
      />
    </div>
  );
};

export default DemandasSearchBar;
