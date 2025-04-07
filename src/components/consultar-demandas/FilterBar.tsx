
import React, { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FilterIcon, X, Grid2X2, List } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useTemasOptions } from '@/hooks/useTemasOptions';
import { useCoordenacoes } from '@/hooks/useCoordenacoes';

interface FilterBarProps {
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  coordenacao: string;
  onCoordenacaoChange: (value: string) => void;
  tema: string;
  onTemaChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
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
  const { coordenacoes, isLoading: isLoadingCoordenacoes } = useCoordenacoes();
  const { temas, isLoading: isLoadingTemas } = useTemasOptions();
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FilterIcon className="h-5 w-5" />
          Filtros
        </h2>
        <div className="flex gap-2">
          <div className="border rounded-md overflow-hidden flex">
            <Button 
              variant={viewMode === 'cards' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-none"
              onClick={() => setViewMode('cards')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="flex items-center">
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="block mb-2">Período</Label>
          <DateRangePicker 
            dateRange={dateRange as any} 
            onRangeChange={onDateRangeChange}
            align="start"
          />
        </div>
        
        <div>
          <Label className="block mb-2">Coordenação</Label>
          <Select value={coordenacao} onValueChange={onCoordenacaoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              {(coordenacoes || []).map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block mb-2">Tema / Serviço</Label>
          <Select value={tema} onValueChange={onTemaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {(temas || []).map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2">Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
              <SelectItem value="arquivada">Arquivada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
