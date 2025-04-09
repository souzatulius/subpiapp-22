
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { RotateCcw } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { supabase } from '@/integrations/supabase/client';

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
  prioridade: string;
  onPrioridadeChange: (prioridade: string) => void;
  onResetFilters: () => void;
}

interface Coordenacao {
  id: string;
  descricao: string;
}

interface Problema {
  id: string;
  descricao: string;
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
  prioridade,
  onPrioridadeChange,
  onResetFilters
}) => {
  const [coordenacoes, setCoordenacoes] = useState<Coordenacao[]>([]);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status options (static values as they are not a table)
  const statusOptions = [
    { value: 'todos', label: 'Todos os status' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'rejeitada', label: 'Recusada' }
  ];

  // Prioridade options (static values as they are not a table)
  const prioridadeOptions = [
    { value: 'todas', label: 'Todas as prioridades' },
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' }
  ];

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch coordenações
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');
          
        if (coordenacoesError) throw coordenacoesError;
        setCoordenacoes(coordenacoesData || []);

        // Fetch problemas
        const { data: problemasData, error: problemasError } = await supabase
          .from('problemas')
          .select('id, descricao')
          .order('descricao');
          
        if (problemasError) throw problemasError;
        setProblemas(problemasData || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="p-4 mb-4 space-y-4 rounded-xl border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-1 flex-wrap gap-3">
          {/* Date Range Picker */}
          <div className="w-full md:w-auto flex-1 min-w-[250px]">
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              align="start"
              className="rounded-xl"
            />
          </div>
          
          {/* Coordenação Filter */}
          <Select value={coordenacao} onValueChange={onCoordenacaoChange} disabled={isLoading}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px] rounded-xl">
              <SelectValue placeholder="Filtrar por coordenação" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="todos">Todas as coordenações</SelectItem>
              {coordenacoes.map(coord => (
                <SelectItem key={coord.id} value={coord.id}>{coord.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tema/Problema Filter */}
          <Select value={tema} onValueChange={onTemaChange} disabled={isLoading}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px] rounded-xl">
              <SelectValue placeholder="Filtrar por tema" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="todos">Todos os temas</SelectItem>
              {problemas.map(problema => (
                <SelectItem key={problema.id} value={problema.id}>{problema.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px] rounded-xl">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={prioridade} onValueChange={onPrioridadeChange}>
            <SelectTrigger className="w-full md:w-auto flex-1 min-w-[150px] rounded-xl">
              <SelectValue placeholder="Filtrar por prioridade" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {prioridadeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResetFilters} className="rounded-xl">
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;
