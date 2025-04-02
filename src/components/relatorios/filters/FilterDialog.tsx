
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import { ReportFilters } from '../hooks/useReportsData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange?: (filters: ReportFilters) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ 
  open, 
  onOpenChange,
  onFiltersChange = () => {}
}) => {
  const defaultDateRange = {
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  };

  const [date, setDate] = useState<DateRange>(defaultDateRange);
  const [coordenacao, setCoordenacao] = useState<string>('');
  const [problema, setProblema] = useState<string>('');
  const [coordenacoes, setCoordenacoes] = useState<{id: string, descricao: string}[]>([]);
  const [problemas, setProblemas] = useState<{id: string, descricao: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch coordenacoes and problemas when dialog opens
  React.useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch coordenacoes
          const { data: coordData, error: coordError } = await supabase
            .from('coordenacoes')
            .select('id, descricao');
          
          if (coordError) throw coordError;
          setCoordenacoes(coordData || []);
          
          // Fetch problemas
          const { data: probData, error: probError } = await supabase
            .from('problemas')
            .select('id, descricao');
          
          if (probError) throw probError;
          setProblemas(probData || []);
          
        } catch (error) {
          console.error('Erro ao buscar dados para os filtros:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [open]);

  const handleApplyFilters = () => {
    const filters: ReportFilters = {
      dateRange: date,
      coordenacao: coordenacao || undefined,
      problema: problema || undefined
    };
    
    onFiltersChange(filters);
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setDate(defaultDateRange);
    setCoordenacao('');
    setProblema('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtros de relatório</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date-range">Período</Label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="coordenacao">Coordenação</Label>
            <Select value={coordenacao} onValueChange={setCoordenacao} disabled={loading}>
              <SelectTrigger id="coordenacao">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as coordenações</SelectItem>
                {coordenacoes.map((coord) => (
                  <SelectItem key={coord.id} value={coord.id}>
                    {coord.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="problema">Problema</Label>
            <Select value={problema} onValueChange={setProblema} disabled={loading}>
              <SelectTrigger id="problema">
                <SelectValue placeholder="Selecione um problema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os problemas</SelectItem>
                {problemas.map((prob) => (
                  <SelectItem key={prob.id} value={prob.id}>
                    {prob.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleResetFilters}>
            Limpar filtros
          </Button>
          <Button onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
