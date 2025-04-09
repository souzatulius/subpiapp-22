
import React, { useRef, useState } from 'react';
import { Search, Command } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useRecentSearches } from '@/hooks/dashboard/useRecentSearches';
import { toast } from '@/hooks/use-toast';

interface DashboardSearchCardProps {
  isEditMode?: boolean;
}

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({ isEditMode = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const { addRecentSearch, recentSearches } = useRecentSearches();

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast({
        title: 'Pesquisa vazia',
        description: 'Por favor, digite algo para pesquisar.',
        variant: 'destructive',
      });
      return;
    }

    addRecentSearch(searchQuery);
    navigate(`/pesquisa?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as unknown as React.FormEvent);
    }
    // Allow space and other keys to work normally (no preventDefault)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = (recentSearches || [])
        .filter((recent) => recent.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/pesquisa?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  if (isEditMode) {
    return (
      <Card className="border border-blue-100 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <p className="text-gray-500">Busca rápida no dashboard</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="relative z-50">
      <Card
        className={`w-full border transition-all duration-200 rounded-xl ${
          isActive ? 'border-blue-400 shadow-md' : 'border-blue-100'
        }`}
      >
        <CardContent className="p-1.5 relative overflow-visible">
          <form onSubmit={handleSearch} className="flex items-center w-full relative">
            <div className="flex items-center flex-grow px-3 py-1.5 relative w-full">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Pesquisar no dashboard..."
                className="flex-grow bg-transparent border-none focus:outline-none text-gray-800 placeholder:text-gray-400"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => {
                  setIsActive(true);
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={(e) => {
                  setIsActive(false);
                  // Delay to allow clicking on suggestions
                  setTimeout(() => {
                    if (
                      suggestionsRef.current &&
                      !suggestionsRef.current.contains(document.activeElement)
                    ) {
                      setShowSuggestions(false);
                    }
                  }, 200);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="hidden md:flex items-center border-l px-3 text-xs text-gray-400 select-none">
              <Command className="h-3.5 w-3.5 mr-1" />
              <span>+</span>
              <span className="mx-1">K</span>
            </div>
          </form>
        </CardContent>
      </Card>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-xl z-[9999]"
          style={{ position: 'absolute', zIndex: 9999 }}
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardSearchCard;
