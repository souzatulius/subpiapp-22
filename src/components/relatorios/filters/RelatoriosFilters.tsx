
import React, { useState, useEffect } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from 'react-day-picker';
import { addDays, subDays } from 'date-fns';
import { ReportFilters } from '../hooks/useReportsData';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface RelatoriosFiltersProps {
  onApplyFilters?: (filters: ReportFilters) => void;
}

const RelatoriosFilters: React.FC<RelatoriosFiltersProps> = ({ onApplyFilters }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [coordenacao, setCoordenacao] = useState<string>('');
  const [problema, setProblema] = useState<string>('');
  const [showKPIs, setShowKPIs] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  
  const [coordenacoes, setCoordenacoes] = useState<any[]>([]);
  const [problemas, setProblemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load coordenações e problemas from Supabase
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        // Fetch coordenacoes
        const { data: coordData, error: coordError } = await supabase
          .from('coordenacoes')
          .select('id, descricao');
        
        if (!coordError && coordData) {
          setCoordenacoes(coordData);
        }
        
        // Fetch problemas
        const { data: probData, error: probError } = await supabase
          .from('problemas')
          .select('id, descricao');
        
        if (!probError && probData) {
          setProblemas(probData);
        }
      } catch (error) {
        console.error('Erro ao carregar opções de filtro:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        dateRange,
        coordenacao: coordenacao || undefined,
        problema: problema || undefined
      });
    }
  };

  const handleReset = () => {
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setCoordenacao('');
    setProblema('');
    setShowKPIs(true);
    setShowGraphs(true);
    
    if (onApplyFilters) {
      onApplyFilters({});
    }
  };

  const getPredefinedRanges = () => [
    {
      label: 'Últimos 7 dias',
      onClick: () => setDateRange({
        from: subDays(new Date(), 7),
        to: new Date()
      })
    },
    {
      label: 'Últimos 30 dias',
      onClick: () => setDateRange({
        from: subDays(new Date(), 30),
        to: new Date()
      })
    },
    {
      label: 'Este mês',
      onClick: () => {
        const now = new Date();
        setDateRange({
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: new Date()
        });
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Período</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {getPredefinedRanges().map((range) => (
            <Badge 
              key={range.label}
              variant="outline" 
              className="cursor-pointer hover:bg-slate-100"
              onClick={range.onClick}
            >
              {range.label}
            </Badge>
          ))}
        </div>
        <DateRangePicker 
          dateRange={dateRange} 
          onRangeChange={setDateRange} 
          className="w-full"
        />
      </div>

      <div className="grid gap-4">
        <div>
          <Label>Coordenação</Label>
          <Select
            value={coordenacao}
            onValueChange={setCoordenacao}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as coordenações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as coordenações</SelectItem>
              {coordenacoes.map((coord) => (
                <SelectItem key={coord.id} value={coord.id}>{coord.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Problema / Tema</Label>
          <Select
            value={problema}
            onValueChange={setProblema}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os problemas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os problemas</SelectItem>
              {problemas.map((prob) => (
                <SelectItem key={prob.id} value={prob.id}>{prob.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Visualização</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-kpis" 
              checked={showKPIs} 
              onCheckedChange={(checked) => setShowKPIs(checked === true)}
            />
            <Label htmlFor="show-kpis">Mostrar indicadores-chave (KPIs)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-graphs" 
              checked={showGraphs}
              onCheckedChange={(checked) => setShowGraphs(checked === true)}
            />
            <Label htmlFor="show-graphs">Mostrar gráficos analíticos</Label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col space-y-2">
        <Button onClick={handleApply}>
          Aplicar filtros
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Redefinir filtros
        </Button>
      </div>
    </div>
  );
};

export default RelatoriosFilters;
