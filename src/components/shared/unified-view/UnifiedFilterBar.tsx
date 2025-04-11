
import React, { useState } from 'react';
import { Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type ViewMode = 'cards' | 'list';

export interface FilterOption {
  id: string;
  label: string;
}

export interface UnifiedFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filterOptions?: {
    primaryFilter?: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
      placeholder?: string;
    };
    secondaryFilter?: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
      placeholder?: string;
    };
  };
  searchPlaceholder?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
  hideViewToggle?: boolean;
}

const UnifiedFilterBar: React.FC<UnifiedFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  filterOptions,
  searchPlaceholder = "Buscar...",
  showBackButton = false,
  onBack,
  className = "",
  hideViewToggle = false
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        {showBackButton && onBack && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isMobile && "Voltar"}
          </Button>
        )}

        <div className="relative flex-1">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 rounded-xl w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {filterOptions && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFilter}
            className={`rounded-xl ${isFilterOpen ? 'bg-blue-50 text-blue-600' : ''}`}
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}

        {!hideViewToggle && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('list')}
              className={`rounded-xl ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('cards')}
              className={`rounded-xl ${viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isFilterOpen && filterOptions && (
        <div className="flex flex-wrap gap-4 animate-fadeInUp">
          {filterOptions.primaryFilter && (
            <div className="w-full sm:w-auto flex-1">
              <Select 
                value={filterOptions.primaryFilter.value} 
                onValueChange={filterOptions.primaryFilter.onChange}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={filterOptions.primaryFilter.placeholder || "Filtrar por"} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.primaryFilter.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.secondaryFilter && (
            <div className="w-full sm:w-auto flex-1">
              <Select 
                value={filterOptions.secondaryFilter.value} 
                onValueChange={filterOptions.secondaryFilter.onChange}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={filterOptions.secondaryFilter.placeholder || "Filtrar por"} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.secondaryFilter.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedFilterBar;
