
import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';
import { SearchSuggestion } from '@/components/dashboard/search/SearchInput';

// Define types for our search actions
export interface SearchAction {
  label: string;
  route: string;
  keywords: string[];
  // Add title property to match SearchSuggestion interface
  title: string;
}

// Predefined search actions with their routes and keywords
const searchActions: SearchAction[] = [
  {
    label: "Nova Demanda de Comunicação",
    title: "Nova Demanda de Comunicação", // Add title to match both interfaces
    route: "/dashboard/comunicacao/cadastrar",
    keywords: ["nova", "demanda", "cadastrar", "criar", "comunicação", "registrar"]
  },
  {
    label: "Aprovar Nota Oficial",
    title: "Aprovar Nota Oficial",
    route: "/dashboard/comunicacao/aprovar-nota",
    keywords: ["aprovar", "nota", "oficial", "autorizar", "verificar"]
  },
  {
    label: "Responder Demandas",
    title: "Responder Demandas",
    route: "/dashboard/comunicacao/responder",
    keywords: ["responder", "atender", "demanda", "pendente", "resposta"]
  },
  {
    label: "Consultar Demandas",
    title: "Consultar Demandas",
    route: "/dashboard/comunicacao/consultar-demandas",
    keywords: ["consultar", "buscar", "encontrar", "demanda", "listar", "visualizar"]
  },
  {
    label: "Criar Nota Oficial",
    title: "Criar Nota Oficial",
    route: "/dashboard/comunicacao/criar-nota",
    keywords: ["criar", "nova", "nota", "oficial", "elaborar", "redigir"]
  },
  {
    label: "Consultar Notas Oficiais",
    title: "Consultar Notas Oficiais",
    route: "/dashboard/comunicacao/consultar-notas",
    keywords: ["consultar", "buscar", "notas", "oficial", "listar", "visualizar"]
  },
  {
    label: "Ver Relatórios",
    title: "Ver Relatórios",
    route: "/dashboard/comunicacao/relatorios",
    keywords: ["relatório", "estatística", "número", "métrica", "dashboard", "indicador"]
  },
  {
    label: "Configurações da Conta",
    title: "Configurações da Conta",
    route: "/settings",
    keywords: ["configuração", "ajuste", "conta", "perfil", "preferência", "setting"]
  }
];

// Keywords to ignore in natural language search
const ignoreWords = [
  "eu", "gostaria", "de", "como", "fazer", "por", "favor", "quero", 
  "preciso", "onde", "está", "o", "a", "os", "as", "um", "uma", "para",
  "olá", "oi", "bom", "dia", "tarde", "noite"
];

export const useSmartSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Initialize Fuse.js with our search actions
  const fuse = useMemo(() => new Fuse(searchActions, {
    keys: ['label', 'keywords'],
    includeScore: true,
    threshold: 0.6, // More lenient matching
    ignoreLocation: true,
    useExtendedSearch: true, // Enable extended search for better phrase matching
  }), []);

  // Function to process natural language queries
  const processNaturalLanguageQuery = (inputQuery: string): string[] => {
    // Convert to lowercase and split by spaces or common punctuation
    const words = inputQuery.toLowerCase()
      .replace(/[,.?!;:]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !ignoreWords.includes(word));
    
    // Return unique words
    return Array.from(new Set(words));
  };

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
      // Process the natural language query
      const searchQuery = query.trim();
      const processedWords = processNaturalLanguageQuery(searchQuery);
      
      // Log the search query for debugging
      console.log('Original query:', searchQuery);
      console.log('Processed words:', processedWords);
      
      // No meaningful words found
      if (processedWords.length === 0) {
        setIsLoading(false);
        setSuggestions([]);
        return;
      }
      
      // Perform a direct search with the full query
      let results = fuse.search(searchQuery);
      
      // Search with individual processed words for better matching
      if (results.length < 3 && processedWords.length > 0) {
        // Create a combined search using processed words
        const wordResults = processedWords.flatMap(word => {
          if (word.length > 2) { // Only use words with 3+ characters
            return fuse.search(word);
          }
          return [];
        });
        
        // Combine and deduplicate results
        const combinedResults = [...results];
        wordResults.forEach(result => {
          if (!combinedResults.some(r => r.item.route === result.item.route)) {
            combinedResults.push(result);
          }
        });
        
        // Sort by relevance score
        results = combinedResults.sort((a, b) => (a.score || 1) - (b.score || 1));
      }
      
      // Map the Fuse.js results to SearchSuggestion type
      const filteredSuggestions = results
        .map(result => ({
          title: result.item.title, // Use title instead of label
          route: result.item.route
        }))
        .slice(0, 5); // Limit to 5 suggestions
      
      console.log('Suggestions:', filteredSuggestions);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, fuse]);

  // Navigate to the selected action's route
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    console.log('Selected suggestion:', suggestion);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(suggestion.route);
  };

  // Handle direct search submission
  const handleSearch = (searchQuery: string) => {
    console.log('Search submitted:', searchQuery);
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
