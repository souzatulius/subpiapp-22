
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComboboxForm } from '@/components/ui/combobox-form';
import { subDays } from 'date-fns';
import { ReportFilters } from '../hooks/useReportsData';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange?: (filters: ReportFilters) => void;
  filters?: ReportFilters;
  chartVisibility?: Record<string, boolean>;
  onChartVisibilityChange?: (chartId: string, visible: boolean) => void;
  onResetFilters?: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  onFiltersChange,
  filters = {},
  chartVisibility = {},
  onChartVisibilityChange,
  onResetFilters
}) => {
  const [dateRange, setDateRange] = React.useState({
    from: filters.dateRange?.from || subDays(new Date(), 90),
    to: filters.dateRange?.to || new Date()
  });

  const [selectedProblema, setSelectedProblema] = React.useState<string | undefined>(
    filters.problema
  );

  const [selectedCoordenacao, setSelectedCoordenacao] = React.useState<string | undefined>(
    filters.coordenacao
  );

  const [visibilitySettings, setVisibilitySettings] = React.useState<Record<string, boolean>>(
    chartVisibility || {
      origemDemandas: true,
      distribuicaoPorTemas: true,
      tempoMedioResposta: true,
      performanceArea: true,
      notasEmitidas: true
    }
  );

  const handleDateFromChange = (date: Date | undefined) => {
    setDateRange(prev => ({ ...prev, from: date || prev.from }));
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateRange(prev => ({ ...prev, to: date || prev.to }));
  };

  const handleToggleChart = (chartId: string) => {
    const newSettings = {
      ...visibilitySettings,
      [chartId]: !visibilitySettings[chartId]
    };
    
    setVisibilitySettings(newSettings);
    
    if (onChartVisibilityChange) {
      onChartVisibilityChange(chartId, newSettings[chartId]);
    }
  };

  const handleApplyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        dateRange: { from: dateRange.from, to: dateRange.to },
        problema: selectedProblema,
        coordenacao: selectedCoordenacao
      });
    }
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
    setDateRange({ from: subDays(new Date(), 90), to: new Date() });
    setSelectedProblema(undefined);
    setSelectedCoordenacao(undefined);
    
    // Reset visibility to defaults
    const defaultVisibility = {
      origemDemandas: true,
      distribuicaoPorTemas: true,
      tempoMedioResposta: true,
      performanceArea: true,
      notasEmitidas: true
    };
    
    setVisibilitySettings(defaultVisibility);
    
    if (onChartVisibilityChange) {
      Object.entries(defaultVisibility).forEach(([chartId, isVisible]) => {
        onChartVisibilityChange(chartId, isVisible);
      });
    }
  };

  const problemaOptions = [
    { value: 'poda', label: 'Poda de Árvores' },
    { value: 'bueiros', label: 'Bueiros' },
    { value: 'remocao', label: 'Remoção de Galhos' },
    { value: 'lixo', label: 'Lixo' },
    { value: 'parques', label: 'Parques e Praças' }
  ];

  const coordenacaoOptions = [
    { value: 'comunicacao', label: 'Comunicação' },
    { value: 'atendimento', label: 'Atendimento ao Cidadão' },
    { value: 'planejamento', label: 'Planejamento' },
    { value: 'gabinete', label: 'Gabinete' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filtros e Visualização</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-2">
            {/* Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Período</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-from">Data Início</Label>
                  <DatePicker
                    date={dateRange.from}
                    onSelect={handleDateFromChange}
                    placeholder="Selecione"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to">Data Fim</Label>
                  <DatePicker
                    date={dateRange.to}
                    onSelect={handleDateToChange}
                    placeholder="Selecione"
                  />
                </div>
              </div>
            </div>
          
            <Separator />
            
            {/* Filters */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Filtros</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Problema</Label>
                  <ComboboxForm
                    options={problemaOptions}
                    value={selectedProblema}
                    placeholder="Selecione o problema"
                    onChange={setSelectedProblema}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Coordenação</Label>
                  <ComboboxForm
                    options={coordenacaoOptions}
                    value={selectedCoordenacao}
                    placeholder="Selecione a coordenação"
                    onChange={setSelectedCoordenacao}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Visualization Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Visualização dos Gráficos</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="origem-demandas" className="cursor-pointer">Origem das Demandas</Label>
                  <Checkbox
                    id="origem-demandas"
                    checked={visibilitySettings.origemDemandas}
                    onCheckedChange={() => handleToggleChart('origemDemandas')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="distribuicao-temas" className="cursor-pointer">Problemas mais frequentes</Label>
                  <Checkbox
                    id="distribuicao-temas"
                    checked={visibilitySettings.distribuicaoPorTemas}
                    onCheckedChange={() => handleToggleChart('distribuicaoPorTemas')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="tempo-resposta" className="cursor-pointer">Tempo Médio de Resposta</Label>
                  <Checkbox
                    id="tempo-resposta"
                    checked={visibilitySettings.tempoMedioResposta}
                    onCheckedChange={() => handleToggleChart('tempoMedioResposta')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="performance-area" className="cursor-pointer">Áreas mais acionadas</Label>
                  <Checkbox
                    id="performance-area"
                    checked={visibilitySettings.performanceArea}
                    onCheckedChange={() => handleToggleChart('performanceArea')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notas-emitidas" className="cursor-pointer">Notas de Imprensa</Label>
                  <Checkbox
                    id="notas-emitidas"
                    checked={visibilitySettings.notasEmitidas}
                    onCheckedChange={() => handleToggleChart('notasEmitidas')}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">
            Limpar Filtros
          </Button>
          <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
