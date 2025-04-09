
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useRecentSearches } from '@/hooks/dashboard/useRecentSearches';
import { toast } from '@/hooks/use-toast';
import SearchInput from './search/SearchInput';

interface DashboardSearchCardProps {
  isEditMode?: boolean;
}

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { addRecentSearch, recentSearches } = useRecentSearches();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast({
        title: 'Pesquisa vazia',
        description: 'Por favor, digite algo para pesquisar.',
        variant: 'destructive',
      });
      return;
    }

    addRecentSearch(query);
    navigate(`/pesquisa?q=${encodeURIComponent(query)}`);
  };

  // Generate suggestions from recent searches
  const suggestions = React.useMemo(() => {
    return (recentSearches || []).map(search => ({
      title: search,
      route: `/pesquisa?q=${encodeURIComponent(search)}`
    }));
  }, [recentSearches]);

  if (isEditMode) {
    return (
      <Card className="border border-blue-100 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center">
            <p className="text-gray-500">Busca rápida no dashboard</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <Card className="w-full border border-blue-100 rounded-xl">
        <CardContent className="p-1.5">
          <SearchInput
            placeholder="Pesquisar no dashboard..."
            onSearch={handleSearch}
            onSelectSuggestion={(suggestion) => {
              navigate(suggestion.route);
            }}
            suggestions={suggestions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSearchCard;
