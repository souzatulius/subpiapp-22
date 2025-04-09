
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
  onChange?: (value: string) => void;
  className?: string;
  suggestions?: SearchSuggestion[];
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "O que deseja fazer?",
  onSearch,
  onSelectSuggestion,
  onChange,
  className = "",
  suggestions = []
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0 && onSelectSuggestion) {
      onSelectSuggestion(suggestions[0]);
    } else if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    // Call the onChange prop if provided
    if (onChange) {
      onChange(newValue);
    }
    
    // Only show suggestions if query is at least 4 characters
    if (newValue.length >= 4 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
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
            onFocus={() => query.length >= 4 && suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={handleBlur}
            className={`pl-14 pr-4 py-6 rounded-xl border border-gray-300 w-full bg-white text-xl text-gray-800 placeholder:text-gray-600 ${className}`}
          />
        </div>
      </form>

      {query.length > 0 && query.length < 4 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Digite pelo menos 4 caracteres para ver sugestões
        </div>
      )}

      <SearchSuggestionsPortal
        suggestions={suggestions}
        isOpen={showSuggestions}
        anchorRef={containerRef}
        onSelect={handleSelectSuggestion}
      />
    </div>
  );
};

export default SearchInput;
