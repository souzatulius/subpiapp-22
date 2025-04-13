
import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SearchSuggestionsPortal from '@/components/dashboard/search/SearchSuggestionsPortal';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestion {
  title: string;
  route: string;
}

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "Pesquisar no dashboard...",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Mock suggestions based on input - you would replace this with real search logic
    if (value.length > 2) {
      const mockSuggestions = [{
        title: `Pesquisar por "${value}"`,
        route: `/search?q=${value}`
      }, {
        title: 'Dashboard',
        route: '/dashboard'
      }, {
        title: 'Configurações',
        route: '/settings'
      }];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        // Direct navigation to search page if onSearch prop isn't provided
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion.title);
    } else {
      // Direct navigation to the suggestion route
      navigate(suggestion.route);
    }
  };

  return <Card className={`w-full bg-transparent border-0 shadow-none ${className}`}>
      <CardContent className="p-4 bg-transparent px-0 my-[22px] py-0">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input ref={inputRef} type="text" placeholder={placeholder} value={query} onChange={handleInputChange} onFocus={() => setShowSuggestions(suggestions.length > 0)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className="pl-12 pr-4 rounded-xl border border-gray-300 w-full bg-white text-lg font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal py-[20px]" />
          </div>
          
          {showSuggestions && <SearchSuggestionsPortal suggestions={suggestions} isOpen={showSuggestions} anchorRef={inputRef} onSelect={handleSelectSuggestion} />}
        </form>
      </CardContent>
    </Card>;
};

export default SmartSearchCard;
