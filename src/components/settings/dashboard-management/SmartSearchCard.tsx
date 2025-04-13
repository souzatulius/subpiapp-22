
// If this file exists in your codebase, replace the content as below:
// If not, this will create a new file with the proper type handling

import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchSuggestionsPortal } from '@/components/dashboard/search/SearchSuggestionsPortal';

interface SearchSuggestion {
  title: string;
  route: string;
}

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "Pesquisar por serviços, cards, configurações...",
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Mock suggestions based on input - you would replace this with real search logic
    if (value.length > 2) {
      const mockSuggestions = [
        { title: `Pesquisar por "${value}"`, route: `/search?q=${value}` },
        { title: 'Dashboard', route: '/dashboard' },
        { title: 'Configurações', route: '/settings' }
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion.title);
    }
  };
  
  return (
    <Card className="w-full bg-transparent border-0 shadow-none">
      <CardContent className="p-4 bg-transparent">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6" />
            <Input
              ref={inputRef}
              type="text" 
              className="pl-14 pr-4 py-5 rounded-xl border border-gray-300 w-full bg-transparent text-2xl font-bold text-gray-800 placeholder:text-gray-600 placeholder:font-bold"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>
          
          {showSuggestions && (
            <SearchSuggestionsPortal
              suggestions={suggestions}
              isOpen={showSuggestions}
              anchorRef={inputRef}
              onSelect={handleSelectSuggestion}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartSearchCard;
