
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SearchSuggestionsPortal from '@/components/dashboard/search/SearchSuggestionsPortal';
import { useNavigate } from 'react-router-dom';
import { useSmartSearch } from '@/hooks/dashboard/useSmartSearch';

interface SearchSuggestion {
  title: string;
  route: string;
}

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  isEditMode?: boolean;
  disableNavigation?: boolean;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "Pesquisar por demandas, notas, configurações...",
  onSearch,
  className = "",
  isEditMode = false,
  disableNavigation = true // Changed default to true to prevent navigation
}) => {
  const { 
    query, 
    setQuery, 
    suggestions, 
    isLoading,
    handleSelectSuggestion,
    handleSearch
  } = useSmartSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else if (!disableNavigation) {
        handleSearch(query);
      }
      setShowSuggestions(false);
    }
  };

  const handleSelectItem = (suggestion: SearchSuggestion) => {
    if (disableNavigation) {
      setQuery(suggestion.title);
    } else {
      handleSelectSuggestion(suggestion);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow space key to be pressed
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Show suggestions when typing with at least 2 characters
  useEffect(() => {
    if (query.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
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
    <Card className={`w-full bg-transparent border-0 shadow-none ${className}`}>
      <CardContent className="p-4 bg-transparent px-0 my-[22px] py-0">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative" ref={containerRef}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              ref={inputRef} 
              type="text" 
              placeholder={placeholder} 
              value={query} 
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-4 rounded-2xl border border-gray-300 w-full bg-white text-lg font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal py-[20px]" 
              disabled={isEditMode}
            />
            
            {/* Render suggestions directly attached to the input */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                <ul className="py-2 max-h-72 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectItem(suggestion)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-lg"
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
                {isLoading && (
                  <div className="p-3 text-center text-gray-500 border-t border-gray-200">
                    <div className="inline-block animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                    Buscando sugestões...
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartSearchCard;
