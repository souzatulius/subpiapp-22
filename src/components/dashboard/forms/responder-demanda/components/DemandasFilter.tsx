
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, List, Grid, ArrowLeft } from 'lucide-react';
import { ViewMode } from '../types';

interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  areaFilter: string;
  setAreaFilter: (value: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  areas: Array<{ id: string; descricao: string }>;
  onBack?: () => void;
  showBackButton?: boolean;
}

const DemandasFilter: React.FC<DemandasFilterProps> = ({
  searchTerm,
  setSearchTerm,
  areaFilter,
  setAreaFilter,
  prioridadeFilter,
  setPrioridadeFilter,
  viewMode,
  setViewMode,
  areas,
  onBack,
  showBackButton = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="flex flex-wrap items-center gap-3">
        {/* Back button - only shown when needed */}
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mr-1"
            title="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        {/* Search input with reduced width */}
        <div className="relative w-64 flex-shrink">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Buscar demandas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        {/* Area filter dropdown */}
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="bg-white w-44">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Priority filter dropdown */}
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger className="bg-white w-44">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Push the view mode toggle to the right */}
        <div className="ml-auto">
          <div className="bg-gray-100 p-1 rounded-md inline-flex">
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-sm px-2 ${viewMode === 'list' ? 'bg-white text-primary-foreground' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'cards' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('cards')}
              className={`rounded-sm px-2 ${viewMode === 'cards' ? 'bg-white text-primary-foreground' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandasFilter;
