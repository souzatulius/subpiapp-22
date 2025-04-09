
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DemandasSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch?: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const DemandasSearchBar: React.FC<DemandasSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm,
  onSearch,
  placeholder = "Buscar demandas...",
  className = ""
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
    <div className={`w-full ${className}`}>
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          type="search" 
          placeholder={placeholder}
          className="pl-9 w-full rounded-xl border-gray-300" 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
    </div>
  );
};

export default DemandasSearchBar;
