import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SearchInput from '@/components/dashboard/search/SearchInput';
import { useSmartSearch } from '@/hooks/dashboard/useSmartSearch';
interface SmartSearchCardProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}
const SmartSearchCard: React.FC<SmartSearchCardProps> = ({
  placeholder = "Pesquisar no dashboard...",
  onSearch,
  className = ""
}) => {
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    handleSearch
  } = useSmartSearch();
  const handleLocalSearch = (searchQuery: string) => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      handleSearch(searchQuery);
    }
  };
  return <div className={`w-full h-full ${className}`}>
      <Card className="w-full h-full border-0 rounded-xl bg-transparent shadow-none">
        <CardContent className="p-3 h-full bg-transparent px-0 py-[5px] my-[6px]">
          <SearchInput placeholder={placeholder} onSearch={handleLocalSearch} suggestions={suggestions.map(suggestion => ({
          title: suggestion.title || 'Sugestão',
          route: suggestion.route
        }))} onChange={value => setQuery(value)} className="w-full h-full" />
        </CardContent>
      </Card>
    </div>;
};
export default SmartSearchCard;