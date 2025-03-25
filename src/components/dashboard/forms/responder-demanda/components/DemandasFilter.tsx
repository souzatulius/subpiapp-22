
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, LayoutGrid, List } from 'lucide-react';
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
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar demanda por título ou área..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-44">
            <Select
              value={areaFilter}
              onValueChange={setAreaFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as áreas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-36">
            <Select
              value={prioridadeFilter}
              onValueChange={setPrioridadeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="média">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
            className="border rounded-md"
          >
            <ToggleGroupItem value="cards" aria-label="Visualização em Cards">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em Lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default DemandasFilter;
