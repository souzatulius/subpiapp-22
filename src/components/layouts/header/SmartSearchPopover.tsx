
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
  const {
    suggestions,
    isLoading
  } = useSmartSearch();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleSelectSuggestion = (suggestion: { title: string; route: string }) => {
    navigate(suggestion.route);
    setIsOpen(false);
  };

  // Transform suggestions to match the expected format for SearchInput
  const formattedSuggestions = suggestions.map(suggestion => ({
    title: suggestion.title || suggestion.name || 'Sugestão',
    route: suggestion.route
  }));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0 rounded-xl">
        <div className="p-3">
          <SearchInput
            placeholder="O que vamos fazer?"
            onSearch={handleSearch}
            onSelectSuggestion={handleSelectSuggestion}
            suggestions={formattedSuggestions}
            className="py-3 text-xl"
          />
        </div>
        
        {isLoading && (
          <div className="p-3 text-sm text-gray-500 italic text-center border-t">
            Buscando...
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SmartSearchPopover;
