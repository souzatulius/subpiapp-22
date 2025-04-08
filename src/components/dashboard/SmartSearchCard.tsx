
import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSmartSearch } from '@/hooks/dashboard/useSmartSearch';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  isEditMode?: boolean;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "O que vamos fazer?",
  onSearch,
  isEditMode = false
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleBlur = () => {
    // Small delay before hiding suggestions to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };
  
  // Stop propagation to avoid triggering drag when in edit mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
    }
  };
  
  return (
    <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="w-[85%] h-[70%] relative" onMouseDown={handleMouseDown}>
        <div className="relative w-full h-full flex items-center">
          <input
            ref={inputRef}
            type="text" 
            className="w-full h-full pl-4 pr-12 py-3 text-lg rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            onMouseDown={handleMouseDown}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-6 w-6 text-blue-800" />
          </div>
        </div>
        
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 shadow-md rounded-lg z-10"
            >
              <ul className="py-1">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.route}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700"
                    onMouseDown={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="flex-grow">
                      <div className="font-medium">{suggestion.label}</div>
                    </div>
                    <div className="text-blue-800">
                      <Search className="h-4 w-4" />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SmartSearchCard;
