
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, List, Grid } from 'lucide-react';
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
  areas
}) => {
  return (
    <>
      {/* Main filter grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 items-center mb-4">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <Input
              placeholder="Buscar demandas por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger>
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
        
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger>
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
      </div>

      {/* View mode toggle */}
      <div className="flex justify-end mb-3">
        <div className="bg-gray-100 p-1 rounded-md inline-flex">
          <Button 
            variant={viewMode === 'list' ? "default" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('list')}
            className={`rounded-sm px-2 ${viewMode === 'list' ? 'bg-white text-primary-foreground' : ''}`}
          >
            <List className="h-4 w-4 mr-1" />
            Lista
          </Button>
          <Button 
            variant={viewMode === 'cards' ? "default" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('cards')}
            className={`rounded-sm px-2 ${viewMode === 'cards' ? 'bg-white text-primary-foreground' : ''}`}
          >
            <Grid className="h-4 w-4 mr-1" />
            Cards
          </Button>
        </div>
      </div>
    </>
  );
};

export default DemandasFilter;
