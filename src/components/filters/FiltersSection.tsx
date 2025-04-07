
import React from 'react';
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
import { CalendarIcon, FilterIcon, XIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';

interface FiltersSectionProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  coordenacao: string;
  onCoordenacaoChange: (value: string) => void;
  coordenacoes: Array<{ id: string; descricao: string }>;
  tema: string;
  onTemaChange: (value: string) => void;
  temas: Array<{ id: string; descricao: string }>;
  onResetFilters: () => void;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  dateRange,
  onDateRangeChange,
  coordenacao,
  onCoordenacaoChange,
  coordenacoes,
  tema,
  onTemaChange,
  temas,
  onResetFilters
}) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FilterIcon className="h-5 w-5" />
          Filtros
        </h2>
        <Button variant="ghost" size="sm" onClick={onResetFilters}>
          <XIcon className="h-4 w-4 mr-1" />
          Limpar filtros
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="block mb-2">Período</Label>
          <DateRangePicker 
            dateRange={dateRange} 
            onRangeChange={onDateRangeChange} 
            align="start"
            locale={ptBR}
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
              {coordenacoes.map((item) => (
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
              {temas.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
