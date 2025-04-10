
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useRecentSearches } from '@/hooks/dashboard/useRecentSearches';
import { toast } from '@/hooks/use-toast';
import SearchInput from '@/components/dashboard/search/SearchInput';

interface DashboardSearchCardProps {
  isEditMode?: boolean;
}

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { addRecentSearch, recentSearches } = useRecentSearches();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
  };

  // Only show suggestions when the user types 4 or more characters
  const suggestions = React.useMemo(() => {
    if (searchQuery.length < 4) return [];
    
    return (recentSearches || [])
      .filter(search => search.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(search => ({
        title: search,
        route: `/pesquisa?q=${encodeURIComponent(search)}`
      }));
  }, [recentSearches, searchQuery]);

  // Add a click handler to prevent drag operations from starting when clicking on the search input
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
    <div ref={containerRef} className="w-full" onClick={handleSearchClick}>
      <Card className="w-full border border-blue-100 rounded-xl">
        <CardContent className="p-3">
          <SearchInput
            placeholder="Pesquisar no dashboard..."
            onSearch={handleSearch}
            suggestions={suggestions}
            onChange={handleSearchInputChange}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSearchCard;
