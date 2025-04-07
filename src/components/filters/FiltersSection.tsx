import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { LayoutGrid, LayoutList, RotateCcw } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface FiltersSectionProps {
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
  dateRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  coordenacao: string;
  onCoordenacaoChange: (coordenacao: string) => void;
  tema: string;
  onTemaChange: (tema: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  onResetFilters: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  viewMode,
  setViewMode,
  dateRange,
  onRangeChange,
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
          <div className="w-full md:w-auto flex-1 min-w-[250px]">
            <DateRangePicker
              value={dateRange}
              onChange={onRangeChange}
              align="start"
            />
          </div>
          
          <Select onValueChange={onCoordenacaoChange} defaultValue={coordenacao}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px]">
              <SelectValue placeholder="Filtrar por coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as coordenações</SelectItem>
              <SelectItem value="COORDENACAO_1">Coordenação 1</SelectItem>
              <SelectItem value="COORDENACAO_2">Coordenação 2</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={onTemaChange} defaultValue={tema}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px]">
              <SelectValue placeholder="Filtrar por tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os temas</SelectItem>
              <SelectItem value="TEMA_1">Tema 1</SelectItem>
              <SelectItem value="TEMA_2">Tema 2</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={onStatusChange} defaultValue={status}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
              <SelectItem value="CONCLUIDO">Concluído</SelectItem>
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

export default FiltersSection;
