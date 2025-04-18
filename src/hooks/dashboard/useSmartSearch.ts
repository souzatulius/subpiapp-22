
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
  title?: string;
}

// Predefined search actions with their routes and keywords
const searchActions: SearchAction[] = [
  {
    label: "Nova Demanda de Comunicação",
    route: "/dashboard/comunicacao/cadastrar",
    keywords: ["nova", "demanda", "cadastrar", "criar", "comunicação", "registrar", "solicitação"]
  },
  {
    label: "Aprovar Nota Oficial",
    route: "/dashboard/comunicacao/aprovar-nota",
    keywords: ["aprovar", "nota", "oficial", "autorizar", "verificar", "notificação", "notificações"]
  },
  {
    label: "Responder Demandas",
    route: "/dashboard/comunicacao/responder",
    keywords: ["responder", "atender", "demanda", "pendente", "resposta", "recusar"]
  },
  {
    label: "Consultar Demandas",
    route: "/dashboard/comunicacao/consultar-demandas",
    keywords: ["consultar", "buscar", "encontrar", "demanda", "listar", "visualizar", "consultat", "ver", "ler"]
  },
  {
    label: "Criar Nota Oficial",
    route: "/dashboard/comunicacao/criar-nota",
    keywords: ["criar", "nova", "nota", "oficial", "elaborar", "redigir", "escrever"]
  },
  {
    label: "Consultar Notas Oficiais",
    route: "/dashboard/comunicacao/consultar-notas",
    keywords: ["consultar", "buscar", "notas", "oficial", "listar", "visualizar", "ver"]
  },
  {
    label: "Ver Relatórios",
    route: "/dashboard/comunicacao/relatorios",
    keywords: ["relatório", "estatística", "número", "métrica", "dashboard", "indicador", "relatórios", "estatísticas", "números", "gráficos"]
  },
  {
    label: "Configurações da Conta",
    route: "/settings",
    keywords: ["configuração", "ajuste", "conta", "perfil", "preferência", "setting", "configurar", "ajustar", "notificações"]
  },
  {
    label: "Painel SGZ",
    route: "/dashboard/zeladoria",
    keywords: ["sgz", "painel", "zeladoria", "ranking"]
  },
  {
    label: "Comunicações para Imprensa",
    route: "/dashboard/comunicacao/imprensa",
    keywords: ["imprensa", "release", "releases", "notícia", "notícias", "comunicação"]
  },
  {
    label: "Editar Perfil",
    route: "/settings/profile",
    keywords: ["editar", "perfil", "conta", "usuário", "senha", "email", "dados"]
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
    threshold: 0.3, // More permissive matching for better results (lowered from 0.5)
    ignoreLocation: true,
    useExtendedSearch: true, // Enable extended search for better phrase matching
  }), []);

  // Function to process natural language queries
  const processNaturalLanguageQuery = (inputQuery: string): string[] => {
    // Convert to lowercase and split by spaces or common punctuation
    const words = inputQuery.toLowerCase()
      .replace(/[,.?!;:]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !ignoreWords.includes(word));
    
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

    // Start search with just 2 characters
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsLoading(true);
    
    // Use a small delay for better UX
    const timer = setTimeout(() => {
      try {
        // Process the natural language query
        const searchQuery = query.trim();
        const processedWords = processNaturalLanguageQuery(searchQuery);
        
        // Log the search query for debugging
        console.log('Search query:', searchQuery, 'Length:', searchQuery.length);
        console.log('Processed words:', processedWords);
        
        // Perform a direct search with the full query
        let results = fuse.search(searchQuery);
        
        // Perform additional specific searches for common terms
        // This helps match important keywords like "nota" directly
        const directMatches = searchActions.filter(action => {
          const lowerLabel = action.label.toLowerCase();
          const lowerKeywords = action.keywords.map(k => k.toLowerCase());
          
          // Check if any keyword or the label contains the search term
          return lowerLabel.includes(searchQuery.toLowerCase()) || 
                 lowerKeywords.some(k => k.includes(searchQuery.toLowerCase()));
        });
        
        // Add any direct matches that aren't already in results
        directMatches.forEach(match => {
          if (!results.some(r => r.item.route === match.route)) {
            results.push({ item: match, refIndex: -1, score: 0.1 });
          }
        });
        
        // Search with individual processed words for better matching
        if (processedWords.length > 0) {
          // Create a combined search using processed words
          const wordResults = processedWords.flatMap(word => {
            return fuse.search(word);
          });
          
          // Combine and deduplicate results
          wordResults.forEach(result => {
            if (!results.some(r => r.item.route === result.item.route)) {
              results.push(result);
            }
          });
          
          // Sort by relevance score
          results = results.sort((a, b) => (a.score || 1) - (b.score || 1));
        }
        
        // Map the Fuse.js results to SearchSuggestion type
        const filteredSuggestions = results
          .map(result => ({
            title: result.item.label, // Use label as title
            route: result.item.route
          }))
          .slice(0, 6); // Limit to 6 suggestions
        
        console.log('Found suggestions:', filteredSuggestions.length);
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      } catch (err) {
        console.error('Error in search:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 150); // Small delay for typing

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
      // Default search page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
