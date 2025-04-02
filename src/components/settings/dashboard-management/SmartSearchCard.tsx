
import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSmartSearch } from '@/hooks/dashboard/useSmartSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SmartSearchCardProps {
  placeholder?: string;
}

export const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "O que vamos fazer?"
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
  
  return (
    <Card className="w-full bg-gray-50 border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="text" 
              className="pl-10 pr-4 py-5 rounded-md border border-gray-300 w-full bg-white"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={handleBlur}
            />
          </div>
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-md z-10"
              >
                <ul className="py-1">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.route}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex-grow">
                        <div className="font-medium text-gray-700">{suggestion.label}</div>
                      </div>
                      <div className="text-gray-400">
                        <Search className="h-4 w-4" />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartSearchCard;
