
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSmartSearch } from '@/hooks/dashboard/useSmartSearch';
import { useNavigate } from 'react-router-dom';

const SmartSearchPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion
  } = useSmartSearch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0">
        <form onSubmit={handleSearchSubmit} className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
            <Input
              className="pl-12 pr-4 py-3 rounded-xl text-xl font-medium text-gray-800 placeholder:text-gray-600 placeholder:font-bold"
              placeholder="O que vamos fazer?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <div className="border-t py-1 max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.route}
                variant="ghost"
                className="w-full justify-start px-3 py-3 h-auto text-lg font-medium"
                onClick={() => {
                  handleSelectSuggestion(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        )}
        {query && suggestions.length === 0 && !isLoading && (
          <div className="p-3 text-sm text-gray-500 italic text-center border-t">
            Nenhuma sugestão encontrada 😅
          </div>
        )}
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
