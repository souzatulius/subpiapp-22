
import React, { KeyboardEvent, useState } from 'react';
import { Search } from 'lucide-react';

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({ 
  placeholder = "O que você deseja fazer?",
  onSearch 
}) => {
  const [query, setQuery] = useState('');

  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query);
      setQuery(''); // Clear after search
    }
  };

  return (
    <div className="w-full h-full bg-white border border-gray-300 rounded-xl shadow-md flex items-center px-6 transition-all hover:shadow-lg">
      <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent text-lg md:text-xl font-medium placeholder-gray-400 focus:outline-none py-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SmartSearchCard;
