
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, List, Grid } from 'lucide-react';
import { Area, ViewMode } from '../types';

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
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
        <Input 
          type="text"
          placeholder="Buscar demandas..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as áreas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>{area.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer prioridade</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="média">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="border rounded-md overflow-hidden flex">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setViewMode('list')}
            className="h-10 w-10"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setViewMode('cards')}
            className="h-10 w-10"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemandasFilter;
