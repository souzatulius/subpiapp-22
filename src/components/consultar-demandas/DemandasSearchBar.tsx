
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DemandasSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch?: (term: string) => void;
}

const DemandasSearchBar: React.FC<DemandasSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm,
  onSearch
}) => {
  // Handle search function to support both direct state update and callback
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          type="search" 
          placeholder="Buscar demandas..." 
          className="pl-9 w-full" 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
    </div>
  );
};

export default DemandasSearchBar;
