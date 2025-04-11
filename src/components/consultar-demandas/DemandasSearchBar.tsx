
import React from 'react';
import { Input } from '@/components/ui/input';

interface DemandasSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const DemandasSearchBar: React.FC<DemandasSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Buscar demandas...",
  className = ""
}) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 rounded-xl w-full"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default DemandasSearchBar;
