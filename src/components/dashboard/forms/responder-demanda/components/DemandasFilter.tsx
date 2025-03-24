
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Filter, Problema, ViewMode } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  counts: Record<Filter, number>;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (prioridade: string) => void;
  areas: Problema[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoadingDemandas: boolean;
}

const DemandasFilter: React.FC<DemandasFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  counts,
  areaFilter,
  setAreaFilter,
  prioridadeFilter,
  setPrioridadeFilter,
  areas,
  viewMode,
  setViewMode,
  isLoadingDemandas
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar demandas..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoadingDemandas}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        <Select value={areaFilter} onValueChange={setAreaFilter} disabled={isLoadingDemandas}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter} disabled={isLoadingDemandas}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as prioridades</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 bg-gray-100 p-2 rounded-md">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex-1 justify-center"
          disabled={isLoadingDemandas}
        >
          Todas ({counts.all})
        </Button>
        <Button
          variant={filter === 'alta' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('alta')}
          className="flex-1 justify-center"
          disabled={isLoadingDemandas}
        >
          Prioritárias ({counts.alta})
        </Button>
        <Button
          variant={filter === 'media' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('media')}
          className="flex-1 justify-center"
          disabled={isLoadingDemandas}
        >
          Médias ({counts.media})
        </Button>
        <Button
          variant={filter === 'baixa' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('baixa')}
          className="flex-1 justify-center"
          disabled={isLoadingDemandas}
        >
          Baixas ({counts.baixa})
        </Button>
      </div>
      
      <div className="flex justify-end">
        <div className="bg-gray-100 p-1 rounded-md flex">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-8 w-8"
            disabled={isLoadingDemandas}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8"
            disabled={isLoadingDemandas}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemandasFilter;
