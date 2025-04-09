import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "O que deseja fazer?",
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keywords to route mapping
  const keywordRoutes = {
    "nota": "/dashboard/comunicacao/notas",
    "notas": "/dashboard/comunicacao/notas",
    "demanda": "/dashboard/comunicacao/demandas",
    "demandas": "/dashboard/comunicacao/demandas",
    "nova": "/dashboard/comunicacao/cadastrar",
    "cadastrar": "/dashboard/comunicacao/cadastrar",
    "criar": "/dashboard/comunicacao/criar-nota",
    "aprovar": "/dashboard/comunicacao/aprovar-nota",
    "release": "/dashboard/comunicacao/cadastrar-release",
    "notícia": "/dashboard/comunicacao/releases",
    "noticia": "/dashboard/comunicacao/releases",
    "esic": "/dashboard/esic",
    "ranking": "/dashboard/zeladoria/ranking-subs",
    "relatório": "/dashboard/comunicacao/relatorios",
    "relatorio": "/dashboard/comunicacao/relatorios",
    "ajuste": "/perfil",
    "perfil": "/perfil",
    "responder": "/dashboard/comunicacao/responder",
    "subs": "/dashboard/zeladoria/ranking-subs",
    "zeladoria": "/dashboard/zeladoria/ranking-subs",
    "recusar": "/dashboard/comunicacao/aprovar-nota",
    "reprovar": "/dashboard/comunicacao/aprovar-nota",
    "editar": "/dashboard/comunicacao/notas",
    "avisos": "/dashboard/comunicacao",
    "coordenação": "/dashboard/comunicacao",
    "coordenacao": "/dashboard/comunicacao",
    "notificações": "/dashboard/notificacoes",
    "notificacoes": "/dashboard/notificacoes"
  };

  // Generate suggestions based on input query
  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    const matchedRoutes = Object.entries(keywordRoutes)
      .filter(([keyword]) => keyword.toLowerCase().includes(lowerQuery))
      .map(([keyword, route]) => ({
        title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        route
      }))
      .slice(0, 5); // Limit to 5 suggestions

    return matchedRoutes;
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    // If we have suggestions, navigate to the first one
    if (suggestions.length > 0) {
      navigate(suggestions[0].route);
      setQuery('');
      return;
    }

    // Otherwise, pass the query to the search handler
    if (onSearch) {
      onSearch(query);
    }

    // Default action if no handler is provided
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle the Enter key - do not interfere with space or other keys
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSelectSuggestion = (suggestion: { title: string; route: string; }) => {
    navigate(suggestion.route);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full relative overflow-visible-container">
      <div className="relative w-full h-full">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-500 z-10" />
        <Input 
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-14 pr-4 py-6 rounded-xl border border-gray-300 w-full h-full bg-white text-2xl text-gray-800 placeholder:text-gray-600"
        />
      </div>
      
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-xl z-50 w-full search-suggestions"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-xl font-medium"
                  onMouseDown={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex-grow">
                    <div className="font-medium text-gray-700">{suggestion.title}</div>
                  </div>
                  <div className="text-gray-400">
                    <Search className="h-6 w-6" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SmartSearchCard;
