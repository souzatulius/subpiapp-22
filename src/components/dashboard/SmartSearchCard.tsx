
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

  // Keywords and suggestions mapping
  const suggestions = [
    { keywords: ['nota', 'notas', 'oficial'], title: 'Notas Oficiais', route: '/dashboard/comunicacao/consultar-notas' },
    { keywords: ['demanda', 'demandas', 'solicitações', 'consultar'], title: 'Demandas', route: '/dashboard/comunicacao/consultar-demandas' },
    { keywords: ['nova', 'cadastrar', 'criar', 'demanda'], title: 'Nova Demanda', route: '/dashboard/comunicacao/cadastrar' },
    { keywords: ['aprovar', 'nota', 'oficial'], title: 'Aprovar Nota', route: '/dashboard/comunicacao/aprovar-nota' },
    { keywords: ['release', 'notícia', 'cadastrar'], title: 'Release', route: '/dashboard/comunicacao/cadastrar-release' },
    { keywords: ['esic', 'informação', 'acesso'], title: 'ESIC', route: '/dashboard/esic' },
    { keywords: ['ranking', 'zeladoria', 'subs'], title: 'Ranking', route: '/dashboard/zeladoria/ranking-subs' },
    { keywords: ['relatório', 'estatística', 'número'], title: 'Relatórios', route: '/dashboard/comunicacao/relatorios' },
    { keywords: ['ajuste', 'perfil', 'conta'], title: 'Perfil', route: '/profile' },
    { keywords: ['responder', 'demanda', 'pendente'], title: 'Responder Demandas', route: '/dashboard/comunicacao/responder' },
    { keywords: ['zeladoria', 'subs'], title: 'Zeladoria', route: '/dashboard/zeladoria' },
    { keywords: ['recusar', 'reprovar', 'nota'], title: 'Recusar Nota', route: '/dashboard/comunicacao/aprovar-nota' },
    { keywords: ['avisos', 'notificação'], title: 'Avisos', route: '/notifications' },
    { keywords: ['coordenação', 'áreas'], title: 'Coordenação', route: '/settings/coordination-areas' },
    { keywords: ['notificação', 'aviso'], title: 'Notificações', route: '/notifications' }
  ];

  // Filter suggestions based on query
  const filteredSuggestions = query.length > 0
    ? suggestions.filter(suggestion => 
        suggestion.keywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.title.toLowerCase().includes(query.toLowerCase())
        )
      ).slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    // If we have suggestions, navigate to the first one
    if (filteredSuggestions.length > 0) {
      navigate(filteredSuggestions[0].route);
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

  const handleSelectSuggestion = (suggestion: { title: string; route: string }) => {
    navigate(suggestion.route);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[80%] h-[80%]">
        <form onSubmit={handleSubmit} className="relative h-full">
          <div className="relative h-full flex items-center">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500" />
            <Input
              ref={inputRef}
              type="text" 
              className="pl-16 pr-6 py-3 rounded-2xl border border-gray-300 w-full h-full bg-white text-2xl font-medium text-gray-800 placeholder:text-2xl placeholder:text-gray-600"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>
          
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-xl z-10"
              >
                <ul className="py-1">
                  {filteredSuggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-xl font-medium"
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex-grow">
                        <div className="font-medium text-gray-700">{suggestion.title}</div>
                      </div>
                      <div className="text-gray-400">
                        <Search className="h-5 w-5" />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default SmartSearchCard;
