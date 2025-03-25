import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, List, Grid } from 'lucide-react';
import { ViewMode } from '../types';
import { Area } from '../types';

interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (prioridade: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  areas: Area[];
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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4 items-center mb-4">
      <div className="col-span-1 md:col-span-2">
        <Input
          type="text"
          placeholder="Buscar demandas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as Áreas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>{area.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as Prioridades</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-4 flex justify-end items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? "text-blue-600" : "text-gray-500"}
        >
          <List className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setViewMode('cards')}
          className={viewMode === 'cards' ? "text-blue-600" : "text-gray-500"}
        >
          <Grid className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default DemandasFilter;
