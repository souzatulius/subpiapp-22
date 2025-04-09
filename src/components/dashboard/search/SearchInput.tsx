
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SearchSuggestionsPortal from './SearchSuggestionsPortal';

interface SearchSuggestion {
  title: string;
  route: string;
}

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  className?: string;
  suggestions?: SearchSuggestion[];
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "O que deseja fazer?",
  onSearch,
  onSelectSuggestion,
  className = "",
  suggestions = []
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (query && suggestions.length) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (filteredSuggestions.length > 0 && onSelectSuggestion) {
      onSelectSuggestion(filteredSuggestions[0]);
    } else if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    setQuery('');
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Small delay to allow click on suggestion
    setTimeout(() => {
      if (isMounted.current) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-500 z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            onBlur={handleBlur}
            className={`pl-14 pr-4 py-6 rounded-xl border border-gray-300 w-full bg-white text-2xl text-gray-800 placeholder:text-gray-600 ${className}`}
          />
        </div>
      </form>

      <SearchSuggestionsPortal
        suggestions={filteredSuggestions}
        isOpen={showSuggestions}
        anchorRef={containerRef}
        onSelect={handleSelectSuggestion}
      />
    </div>
  );
};

export default SearchInput;
