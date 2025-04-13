
import React from 'react';
import { Search } from 'lucide-react';

interface ReleasesSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
}

const ReleasesSearch: React.FC<ReleasesSearchProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Pesquisar por título ou conteúdo..."
        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        onClick={onSearch}
      />
    </div>
  );
};

export default ReleasesSearch;
