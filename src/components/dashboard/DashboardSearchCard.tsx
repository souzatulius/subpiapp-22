
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

interface DashboardSearchCardProps {
  isEditMode?: boolean;
}

// Define search suggestions data
interface SearchSuggestion {
  title: string;
  path: string;
  keywords: string[];
}

const searchSuggestions: SearchSuggestion[] = [
  { title: "Notas Oficiais", path: "/dashboard/comunicacao/consultar-notas", keywords: ["notas", "oficial", "consultar"] },
  { title: "Demandas", path: "/dashboard/comunicacao/consultar-demandas", keywords: ["demandas", "consultar", "listar"] },
  { title: "Nova Demanda", path: "/dashboard/comunicacao/cadastrar", keywords: ["nova", "demanda", "cadastrar", "criar"] },
  { title: "Aprovar Nota", path: "/dashboard/comunicacao/aprovar-nota", keywords: ["aprovar", "nota", "oficial"] },
  { title: "Release", path: "/dashboard/comunicacao/cadastrar-release", keywords: ["release", "notícia", "cadastrar"] },
  { title: "ESIC", path: "/dashboard/esic", keywords: ["esic", "informação", "acesso"] },
  { title: "Ranking", path: "/dashboard/zeladoria/ranking", keywords: ["ranking", "zeladoria", "subs"] },
  { title: "Relatórios", path: "/dashboard/comunicacao/relatorios", keywords: ["relatório", "estatísticas", "números"] },
  { title: "Perfil", path: "/profile", keywords: ["perfil", "ajuste", "conta"] },
  { title: "Responder Demandas", path: "/dashboard/comunicacao/responder", keywords: ["responder", "demanda", "pendente"] },
  { title: "Zeladoria", path: "/dashboard/zeladoria", keywords: ["zeladoria", "subs"] },
  { title: "Recusar Nota", path: "/dashboard/comunicacao/aprovar-nota", keywords: ["recusar", "reprovar", "nota"] },
  { title: "Avisos", path: "/notifications", keywords: ["avisos", "notificações"] },
  { title: "Coordenação", path: "/settings/coordination-areas", keywords: ["coordenação", "áreas"] },
  { title: "Notificações", path: "/notifications", keywords: ["notificações", "avisos"] }
];

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({
  isEditMode = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  // Initialize Fuse.js for search
  const fuse = new Fuse(searchSuggestions, {
    keys: ['title', 'keywords'],
    threshold: 0.4,
    includeScore: true
  });
  
  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim()) {
      const results = fuse.search(query);
      setSuggestions(results.map(result => result.item).slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    if (suggestions.length > 0) {
      // Navigate to the first suggestion
      navigate(suggestions[0].path);
      setQuery('');
      setShowSuggestions(false);
    } else {
      // Navigate to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    navigate(suggestion.path);
    setQuery('');
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  const handleBlur = () => {
    // Small delay to allow clicking on a suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Stop propagation to avoid triggering drag when in edit mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
      <form onSubmit={handleSubmit} className="w-full h-full flex items-center" onMouseDown={handleMouseDown}>
        <div className="relative w-full h-full flex items-center">
          <input
            type="text"
            className="w-full pl-14 pr-16 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold text-gray-800 placeholder:text-gray-600 placeholder:font-bold"
            placeholder="O que deseja fazer?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            onBlur={handleBlur}
            onMouseDown={handleMouseDown}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-500" />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2"
            onMouseDown={handleMouseDown}
          >
            <Search className="h-10 w-10 text-gray-500 hover:text-blue-500 transition-colors" />
          </button>
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 w-11/12 mx-auto">
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-xl font-medium text-gray-700"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  <Search className="h-6 w-6 mr-3 text-gray-500" />
                  {suggestion.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default DashboardSearchCard;
