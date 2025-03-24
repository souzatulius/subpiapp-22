
import React, { KeyboardEvent, useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useSmartSearch, SearchAction } from '@/hooks/dashboard/useSmartSearch';

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({ 
  placeholder = "O que você deseja fazer?",
  onSearch 
}) => {
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    handleSearch
  } = useSmartSearch();
  
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keys without any prevention for space
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else {
        handleSearch(query);
        onSearch(query);
      }
      setQuery(''); // Clear after search
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions && suggestions.length > 0) {
      // Focus on the first suggestion
      const firstSuggestion = suggestionsRef.current?.querySelector('button');
      firstSuggestion?.focus();
    }
  };

  // Handle suggestion navigation with keyboard
  const handleSuggestionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextSuggestion = suggestionsRef.current?.querySelectorAll('button')[index + 1];
      nextSuggestion?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
      } else {
        const prevSuggestion = suggestionsRef.current?.querySelectorAll('button')[index - 1];
        prevSuggestion?.focus();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSuggestions]);

  // Directly handle input change without any filtering of space characters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full bg-white border border-gray-300 rounded-xl shadow-md flex items-center px-6 transition-all hover:shadow-lg">
        <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-lg md:text-xl font-medium placeholder-gray-400 focus:outline-none py-4"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={() => query.trim() && setShowSuggestions(true)}
        />
        {isLoading && <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="max-h-72 overflow-y-auto p-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.route}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg transition-colors"
                onClick={() => handleSelectSuggestion(suggestion)}
                onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
              >
                <div className="font-medium text-subpi-gray-text">
                  {suggestion.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearchCard;
