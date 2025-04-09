
import React, { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useRecentSearches } from '@/hooks/dashboard/useRecentSearches';
import { toast } from '@/hooks/use-toast';

interface DashboardSearchCardProps {
  isEditMode?: boolean;
}

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({ isEditMode = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { addRecentSearch } = useRecentSearches();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Pesquisa vazia",
        description: "Por favor, digite algo para pesquisar.",
        variant: "destructive",
      });
      return;
    }
    
    // Add to recent searches
    addRecentSearch(searchQuery);
    
    // Redirect to search results page
    navigate(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
    
    // Reset search query
    setSearchQuery('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as unknown as React.FormEvent);
    }
  };
  
  if (isEditMode) {
    return (
      <Card className="border border-blue-100 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <p className="text-gray-500">Busca rápida no dashboard</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`w-full border transition-all duration-200 rounded-xl ${isActive ? 'border-blue-400 shadow-md' : 'border-blue-100'}`}>
      <CardContent className="p-1.5">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <div className="flex items-center flex-grow px-3 py-1.5">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar no dashboard..."
              className="flex-grow bg-transparent border-none focus:outline-none text-gray-800 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="hidden md:flex items-center border-l px-3 text-xs text-gray-400 select-none">
            <Command className="h-3.5 w-3.5 mr-1" />
            <span>+</span>
            <span className="mx-1">K</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSearchCard;
