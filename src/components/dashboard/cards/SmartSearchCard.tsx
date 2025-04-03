
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  isEditMode?: boolean;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "O que você procura na Comunicação?",
  onSearch,
  isEditMode = false
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    if (onSearch) {
      onSearch(query);
    } else {
      // Default behavior: navigate to search page
      navigate(`/dashboard/comunicacao/demandas?q=${encodeURIComponent(query)}`);
    }
  };

  // Stop propagation to avoid triggering drag when in edit mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full h-full bg-gray-50 border border-gray-200 flex items-center p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="w-full flex items-center" onMouseDown={handleMouseDown}>
          <div className="relative w-full h-full flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onMouseDown={handleMouseDown}
            />
            <button
              type="submit"
              className="ml-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onMouseDown={handleMouseDown}
            >
              Buscar
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SmartSearchCard;
