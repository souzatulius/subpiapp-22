
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, LayoutDashboard, RotateCcw, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { ReportFilters } from '../hooks/useReportsData';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters?: ReportFilters;
  onFiltersChange?: (filters: ReportFilters) => void;
  onResetFilters?: () => void;
}

interface ChartVisibility {
  distribuicaoPorTemas: boolean;
  origemDemandas: boolean;
  tempoMedioResposta: boolean;
  performanceArea: boolean;
  notasEmitidas: boolean;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters = {},
  onFiltersChange = () => {},
  onResetFilters = () => {}
}) => {
  const [visibleCharts, setVisibleCharts] = useLocalStorage<string[]>(
    'relatorios-graph-visible', 
    ['distribuicaoPorTemas', 'origemDemandas', 'tempoMedioResposta', 'performanceArea', 'notasEmitidas']
  );
  
  const handleChartVisibilityChange = (chartId: string, isVisible: boolean) => {
    if (isVisible) {
      setVisibleCharts(prev => [...prev, chartId]);
    } else {
      setVisibleCharts(prev => prev.filter(id => id !== chartId));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-orange-700">
            <Filter className="h-5 w-5" />
            Filtros e Visualização
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="filters">
          <TabsList className="w-full mb-6 bg-orange-50">
            <TabsTrigger value="filters" className="flex-1">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </TabsTrigger>
            <TabsTrigger value="visibility" className="flex-1">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Visualização
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Filtro de data */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Período</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-xs text-gray-500">Data Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dateRange?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange?.from ? (
                            format(new Date(filters.dateRange.from), "d MMM/yy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange?.from}
                          onSelect={date => {
                            const newDateRange: DateRange = {
                              ...filters.dateRange,
                              from: date
                            };
                            onFiltersChange({ ...filters, dateRange: newDateRange });
                          }}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label className="text-xs text-gray-500">Data Fim</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dateRange?.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange?.to ? (
                            format(new Date(filters.dateRange.to), "d MMM/yy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange?.to}
                          onSelect={date => {
                            const newDateRange: DateRange = {
                              ...filters.dateRange,
                              to: date
                            };
                            onFiltersChange({ ...filters, dateRange: newDateRange });
                          }}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Filtro de coordenação */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Coordenação</Label>
                <Select 
                  value={filters.coordenacao || ''} 
                  onValueChange={value => onFiltersChange({ ...filters, coordenacao: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a coordenação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="coord1">CPDU</SelectItem>
                    <SelectItem value="coord2">CPO</SelectItem>
                    <SelectItem value="coord3">Governo Local</SelectItem>
                    <SelectItem value="coord4">Jurídico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de tema/problema */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tema / Problema</Label>
                <Select 
                  value={filters.problema || ''} 
                  onValueChange={value => onFiltersChange({ ...filters, problema: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="prob1">Bueiros</SelectItem>
                    <SelectItem value="prob2">Poda de Árvores</SelectItem>
                    <SelectItem value="prob3">Remoção de galhos</SelectItem>
                    <SelectItem value="prob4">Lixo</SelectItem>
                    <SelectItem value="prob5">Parques e praças</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visibility" className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <h3 className="font-medium text-gray-700">Visibilidade de gráficos</h3>
              <div className="bg-orange-50 p-4 rounded-md text-orange-800 text-sm">
                Ative ou desative a exibição dos gráficos no painel. Você poderá reativá-los a qualquer momento.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="chart-problemas" className="font-medium cursor-pointer text-sm">
                    Problemas mais frequentes
                  </Label>
                  <Switch
                    id="chart-problemas"
                    checked={visibleCharts.includes('distribuicaoPorTemas')}
                    onCheckedChange={(checked) => 
                      handleChartVisibilityChange('distribuicaoPorTemas', checked)
                    }
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="chart-origem" className="font-medium cursor-pointer text-sm">
                    Origem das Demandas
                  </Label>
                  <Switch
                    id="chart-origem"
                    checked={visibleCharts.includes('origemDemandas')}
                    onCheckedChange={(checked) => 
                      handleChartVisibilityChange('origemDemandas', checked)
                    }
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="chart-tempo" className="font-medium cursor-pointer text-sm">
                    Tempo Médio de Resposta
                  </Label>
                  <Switch
                    id="chart-tempo"
                    checked={visibleCharts.includes('tempoMedioResposta')}
                    onCheckedChange={(checked) => 
                      handleChartVisibilityChange('tempoMedioResposta', checked)
                    }
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="chart-areas" className="font-medium cursor-pointer text-sm">
                    Áreas mais acionadas
                  </Label>
                  <Switch
                    id="chart-areas"
                    checked={visibleCharts.includes('performanceArea')}
                    onCheckedChange={(checked) => 
                      handleChartVisibilityChange('performanceArea', checked)
                    }
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label htmlFor="chart-notas" className="font-medium cursor-pointer text-sm">
                    Notas de Imprensa
                  </Label>
                  <Switch
                    id="chart-notas"
                    checked={visibleCharts.includes('notasEmitidas')}
                    onCheckedChange={(checked) => 
                      handleChartVisibilityChange('notasEmitidas', checked)
                    }
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onResetFilters} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
            <Button onClick={() => onOpenChange(false)} className="bg-orange-500 hover:bg-orange-600">
              Aplicar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
