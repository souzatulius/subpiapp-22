
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useSmartSearch } from '@/hooks/dashboard/useSmartSearch';
import { useNavigate } from 'react-router-dom';
import SearchInput from '@/components/dashboard/search/SearchInput';

const SmartSearchPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    suggestions,
    isLoading,
    setQuery
  } = useSmartSearch();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: { title: string; route: string }) => {
    navigate(suggestion.route);
    setIsOpen(false);
  };
  
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    setQuery(value);
  };

  // Only show suggestions when the user types 2 or more characters
  const filteredSuggestions = searchQuery.length >= 2 
    ? suggestions
    : [];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0 rounded-xl bg-white border shadow-md">
        <div className="p-3 w-full h-full">
          <SearchInput
            placeholder="O que vamos fazer?"
            onSearch={handleSearch}
            onSelectSuggestion={handleSelectSuggestion}
            suggestions={filteredSuggestions}
            onChange={handleSearchInputChange}
            className="py-3 text-xl"
          />
        </div>
        
        {isLoading && searchQuery.length >= 2 && (
          <div className="p-3 text-sm text-gray-500 italic text-center bg-white border-t border-gray-200 rounded-b-xl">
            Buscando...
          </div>
        )}
        
        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <div className="p-3 text-sm text-gray-500 italic text-center bg-white border-t border-gray-200 rounded-b-xl">
            Digite pelo menos 2 caracteres para ver sugestões
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SmartSearchPopover;
