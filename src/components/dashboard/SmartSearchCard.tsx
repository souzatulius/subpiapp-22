
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from './search/SearchInput';

interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "O que deseja fazer?",
  onSearch
}) => {
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
    const matchedRoutes = Object.entries(keywordRoutes)
      .map(([keyword, route]) => ({
        title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        route
      }));

    return matchedRoutes;
  }, []);

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSelectSuggestion = (suggestion: { title: string; route: string }) => {
    navigate(suggestion.route);
  };

  return (
    <div className="w-full h-full">
      <SearchInput
        placeholder={placeholder}
        onSearch={handleSearch}
        onSelectSuggestion={handleSelectSuggestion}
        suggestions={suggestions}
      />
    </div>
  );
};

export default SmartSearchCard;
