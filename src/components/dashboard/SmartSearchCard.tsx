
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
  disableNavigation = false
}) => {
  const { 
    suggestions, 
    isLoading,
    setQuery,
    handleSelectSuggestion,
    handleSearch
  } = useSmartSearch();
  
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Filter suggestions based on input
  const filteredSuggestions = inputValue.length >= 2 
    ? suggestions
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setQuery(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (onSearch) {
        onSearch(inputValue);
      } else if (!disableNavigation) {
        handleSearch(inputValue);
      }
      setShowSuggestions(false);
    }
  };

  const handleSelectItem = (suggestion: SearchSuggestion) => {
    if (disableNavigation) {
      setInputValue(suggestion.title);
    } else {
      handleSelectSuggestion(suggestion);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Show suggestions when typing with at least 2 characters
  useEffect(() => {
    if (inputValue.length >= 2 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    } else if (inputValue.length === 0) {
      setShowSuggestions(false);
    }
  }, [inputValue, filteredSuggestions]);

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

  if (isEditMode) {
    return (
      <Card className={`w-full bg-transparent border-0 shadow-none ${className}`}>
        <CardContent className="p-4 bg-transparent px-0 my-[22px] py-0">
          <form className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input 
                type="text" 
                placeholder={placeholder} 
                className="pl-12 pr-4 rounded-2xl border border-gray-300 w-full bg-white text-lg font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal py-[20px]" 
                disabled={true}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

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
              value={inputValue} 
              onChange={handleInputChange}
              onFocus={() => inputValue.length >= 2 && filteredSuggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-4 rounded-2xl border border-gray-300 w-full bg-white text-lg font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal py-[20px]" 
              disabled={isEditMode}
            />
            
            {/* Display loading indicator when searching */}
            {isLoading && inputValue.length >= 2 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
              </div>
            )}
            
            {/* Render suggestions directly attached to the input */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                <ul className="py-2 max-h-72 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectItem(suggestion)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-lg"
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Show "no results" message when actively searching but no results */}
            {inputValue.length >= 2 && !isLoading && filteredSuggestions.length === 0 && (
              <div className="absolute z-20 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                <div className="py-3 text-center text-gray-500">
                  Nenhum resultado encontrado para "{inputValue}"
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartSearchCard;
