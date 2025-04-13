
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SearchSuggestionsPortal from './SearchSuggestionsPortal';

export interface SearchSuggestion {
  title: string;
  route: string;
}

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  className?: string;
  onChange?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Pesquisar...',
  onSearch,
  onSelectSuggestion,
  suggestions = [],
  className = '',
  onChange
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    } else {
      setQuery(suggestion.title);
      onSearch(suggestion.title);
    }
    setShowSuggestions(false);
  };

  // Show suggestions automatically when typing
  useEffect(() => {
    // Only show suggestions if query is at least 4 characters
    if (query.length >= 4 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (query.length === 0) {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative h-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input 
          ref={inputRef} 
          type="search" 
          placeholder={placeholder} 
          value={query} 
          onChange={handleInputChange} 
          onFocus={() => setShowSuggestions(suggestions.length > 0)} 
          onKeyDown={handleKeyDown} 
          className="pl-10 pr-4 w-full h-full bg-transparent border-gray-300" 
        />
      </form>

      {/* Use the portal component for suggestions */}
      <SearchSuggestionsPortal 
        suggestions={suggestions} 
        isOpen={showSuggestions && suggestions.length > 0} 
        anchorRef={containerRef} 
        onSelect={handleSelectSuggestion} 
      />
    </div>
  );
};

export default SearchInput;
