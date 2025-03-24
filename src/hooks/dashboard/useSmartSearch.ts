
import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';

// Define types for our search actions
export interface SearchAction {
  label: string;
  route: string;
  keywords: string[];
}

// Predefined search actions with their routes and keywords
const searchActions: SearchAction[] = [
  {
    label: "Nova Demanda de Comunicação",
    route: "/dashboard/comunicacao/cadastrar",
    keywords: ["nova", "demanda", "cadastrar", "criar", "comunicação", "registrar"]
  },
  {
    label: "Aprovar Nota Oficial",
    route: "/dashboard/comunicacao/aprovar-nota",
    keywords: ["aprovar", "nota", "oficial", "autorizar", "verificar"]
  },
  {
    label: "Responder Demandas",
    route: "/dashboard/comunicacao/responder",
    keywords: ["responder", "atender", "demanda", "pendente", "resposta"]
  },
  {
    label: "Consultar Demandas",
    route: "/dashboard/comunicacao/consultar-demandas",
    keywords: ["consultar", "buscar", "encontrar", "demanda", "listar", "visualizar"]
  },
  {
    label: "Criar Nota Oficial",
    route: "/dashboard/comunicacao/criar-nota",
    keywords: ["criar", "nova", "nota", "oficial", "elaborar", "redigir"]
  },
  {
    label: "Consultar Notas Oficiais",
    route: "/dashboard/comunicacao/consultar-notas",
    keywords: ["consultar", "buscar", "notas", "oficial", "listar", "visualizar"]
  },
  {
    label: "Ver Relatórios",
    route: "/dashboard/comunicacao/relatorios",
    keywords: ["relatório", "estatística", "número", "métrica", "dashboard", "indicador"]
  },
  {
    label: "Configurações da Conta",
    route: "/settings",
    keywords: ["configuração", "ajuste", "conta", "perfil", "preferência", "setting"]
  }
];

export const useSmartSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Initialize Fuse.js with our search actions
  const fuse = useMemo(() => new Fuse(searchActions, {
    keys: ['label', 'keywords'],
    includeScore: true,
    threshold: 0.4, // Lower threshold means more strict matching
    ignoreLocation: true,
  }), []);

  // Update suggestions when the query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate a small delay for better UX
    const timer = setTimeout(() => {
      const results = fuse.search(query.trim());
      
      // Map the Fuse.js results to our SearchAction type
      const filteredSuggestions = results
        .map(result => result.item)
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, fuse]);

  // Navigate to the selected action's route
  const handleSelectSuggestion = (action: SearchAction) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(action.route);
  };

  // Handle direct search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() && suggestions.length > 0) {
      // Navigate to the first suggestion
      handleSelectSuggestion(suggestions[0]);
    } else {
      // Could handle a more general search here
      console.log('No direct match found for:', searchQuery);
    }
  };

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    handleSearch
  };
};
