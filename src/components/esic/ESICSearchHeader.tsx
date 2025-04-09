
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, List, Grid, Filter } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ESICSearchHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: 'list' | 'cards';
  onViewModeChange: (value: 'list' | 'cards') => void;
  onFilterClick: () => void;
  onNewProcessClick: () => void;
}

const ESICSearchHeader: React.FC<ESICSearchHeaderProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterClick,
  onNewProcessClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1 w-full sm:w-auto">
        <Input
          placeholder="Pesquisar processos..."
          value={searchTerm}
          onChange={onSearchChange}
          className="bg-white rounded-lg border-gray-200"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <ToggleGroup 
          type="single" 
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as 'list' | 'cards')}
          className="border rounded-lg"
        >
          <ToggleGroupItem value="list" aria-label="Lista">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cards" aria-label="Cards">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onFilterClick}
          className="rounded-lg"
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={onNewProcessClick}
          className="rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>
    </div>
  );
};

export default ESICSearchHeader;
