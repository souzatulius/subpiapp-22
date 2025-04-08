
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, List, Grid, SlidersHorizontal, Plus } from 'lucide-react';

interface ESICSearchHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewModeChange: (mode: 'list' | 'cards') => void;
  onFilterClick: () => void;
  onNewProcessClick: () => void;
  viewMode: 'list' | 'cards';
}

const ESICSearchHeader: React.FC<ESICSearchHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onViewModeChange,
  onFilterClick,
  onNewProcessClick,
  viewMode
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search and New Process button row */}
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar processos..."
              className="pl-9 pr-4 py-2 h-10 bg-white border-gray-300"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
          
          <Button 
            onClick={() => onNewProcessClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Novo Processo</span>
          </Button>
        </div>
      </div>
      
      {/* View toggle buttons row */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          className={`h-9 w-9 ${viewMode === 'list' ? 'bg-gray-100 border-gray-400' : 'bg-white'}`}
          onClick={() => onViewModeChange('list')}
          title="Visualização em lista"
        >
          <List className="h-4 w-4 text-gray-700" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={`h-9 w-9 ${viewMode === 'cards' ? 'bg-gray-100 border-gray-400' : 'bg-white'}`}
          onClick={() => onViewModeChange('cards')}
          title="Visualização em cards"
        >
          <Grid className="h-4 w-4 text-gray-700" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-white hover:bg-gray-100"
          onClick={onFilterClick}
          title="Filtros"
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
    </div>
  );
};

export default ESICSearchHeader;
