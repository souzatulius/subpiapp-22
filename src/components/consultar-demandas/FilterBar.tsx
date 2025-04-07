import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { LayoutGrid, LayoutList, RotateCcw } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface FilterBarProps {
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  coordenacao: string;
  onCoordenacaoChange: (coordenacao: string) => void;
  tema: string;
  onTemaChange: (tema: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  onResetFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  setViewMode,
  dateRange,
  onDateRangeChange,
  coordenacao,
  onCoordenacaoChange,
  tema,
  onTemaChange,
  status,
  onStatusChange,
  onResetFilters
}) => {

  return (
    <Card className="p-4 mb-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-1 flex-wrap gap-3">
          {/* Date Range Picker */}
          <div className="w-full md:w-auto flex-1 min-w-[250px]">
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              align="start"
            />
          </div>
          
          {/* Coordenação Filter */}
          <Select value={coordenacao} onValueChange={onCoordenacaoChange}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px]">
              <SelectValue placeholder="Filtrar por coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as coordenações</SelectItem>
              <SelectItem value="coordenacao1">Coordenação 1</SelectItem>
              <SelectItem value="coordenacao2">Coordenação 2</SelectItem>
              {/* Add more coordenações as needed */}
            </SelectContent>
          </Select>

          {/* Tema Filter */}
          <Select value={tema} onValueChange={onTemaChange}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px]">
              <SelectValue placeholder="Filtrar por tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os temas</SelectItem>
              <SelectItem value="tema1">Tema 1</SelectItem>
              <SelectItem value="tema2">Tema 2</SelectItem>
              {/* Add more temas as needed */}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              {/* Add more status options as needed */}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}>
            {viewMode === 'cards' ? (
              <>
                <LayoutList className="h-4 w-4 mr-2" />
                Ver como Lista
              </>
            ) : (
              <>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Ver como Cards
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;
