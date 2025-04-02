
import React, { useState, useEffect } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { ReportFilters } from '../hooks/useReportsData';

interface RelatoriosFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onResetFilters: () => void;
}

export const RelatoriosFilters: React.FC<RelatoriosFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  onResetFilters 
}) => {
  const [coordenacoes, setCoordenacoes] = useState<{id: string, descricao: string}[]>([]);
  const [problemas, setProblemas] = useState<{id: string, descricao: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        // Fetch coordenações
        const { data: coordData, error: coordError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');
        
        if (coordError) throw coordError;
        setCoordenacoes(coordData || []);
        
        // Fetch problemas
        const { data: probData, error: probError } = await supabase
          .from('problemas')
          .select('id, descricao')
          .order('descricao');
        
        if (probError) throw probError;
        setProblemas(probData || []);
      } catch (error) {
        console.error('Erro ao buscar opções de filtro:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  const handleDateRangeChange = (range: DateRange) => {
    onFiltersChange({
      ...filters,
      dateRange: range
    });
  };
  
  const handleCoordenacaoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      coordenacao: value === 'todos' ? undefined : value
    });
  };
  
  const handleProblemaChange = (value: string) => {
    onFiltersChange({
      ...filters,
      problema: value === 'todos' ? undefined : value
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm mb-1 block">Período</Label>
        <DateRangePicker 
          dateRange={filters.dateRange || { from: subDays(new Date(), 90), to: new Date() }} 
          onRangeChange={handleDateRangeChange} 
        />
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">Coordenação</Label>
        <Select 
          value={filters.coordenacao || 'todos'} 
          onValueChange={handleCoordenacaoChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a coordenação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as coordenações</SelectItem>
            {coordenacoes.map(coord => (
              <SelectItem key={coord.id} value={coord.id}>
                {coord.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">Tema / Problema</Label>
        <Select 
          value={filters.problema || 'todos'} 
          onValueChange={handleProblemaChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os temas</SelectItem>
            {problemas.map(prob => (
              <SelectItem key={prob.id} value={prob.id}>
                {prob.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onResetFilters} 
        className="w-full"
      >
        Limpar filtros
      </Button>
    </div>
  );
};

export default RelatoriosFilters;
