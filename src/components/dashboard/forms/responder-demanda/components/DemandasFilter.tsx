
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
          <Input
            placeholder="Buscar demandas por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger>
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
        
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* New section - Place for additional fields */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Campos adicionais</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Add your new fields here */}
          <div className="col-span-1">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opcao1">Opção 1</SelectItem>
                <SelectItem value="opcao2">Opção 2</SelectItem>
                <SelectItem value="opcao3">Opção 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Input placeholder="Campo adicional..." />
          </div>
          <div className="col-span-1">
            <Button variant="outline" className="w-full">
              Aplicar
            </Button>
          </div>
        </div>
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
