
import React from 'react';
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
import { CalendarIcon, Filter, LayoutDashboard, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ChartVisibility, FilterOptions } from '../types';
import MultiSelect from '@/components/ui/multiselect';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  chartVisibility: ChartVisibility;
  onChartVisibilityChange: (chartName: keyof ChartVisibility, isVisible: boolean) => void;
  onResetFilters: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  chartVisibility,
  onChartVisibilityChange,
  onResetFilters,
}) => {
  // Opções de filtro (mock)
  const statusOptions = [
    { label: 'Aberto', value: 'ABERTO' },
    { label: 'Em Andamento', value: 'ANDAMENTO' },
    { label: 'Concluído', value: 'CONCLUIDO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ];

  const distritosOptions = [
    { label: 'Alto de Pinheiros', value: 'ALTO DE PINHEIROS' },
    { label: 'Bela Vista', value: 'BELA VISTA' },
    { label: 'Butantã', value: 'BUTANTA' },
    { label: 'Itaim Bibi', value: 'ITAIM BIBI' },
    { label: 'Jardim Paulista', value: 'JARDIM PAULISTA' },
    { label: 'Lapa', value: 'LAPA' },
    { label: 'Morumbi', value: 'MORUMBI' },
    { label: 'Pinheiros', value: 'PINHEIROS' },
    { label: 'Raposo Tavares', value: 'RAPOSO TAVARES' },
    { label: 'Vila Sônia', value: 'VILA SONIA' },
  ];

  const tiposServicoOptions = [
    { label: 'Tapa Buraco', value: 'TAPA BURACO' },
    { label: 'Poda de Árvore', value: 'PODA DE ARVORE' },
    { label: 'Limpeza de Córrego', value: 'LIMPEZA DE CORREGO' },
    { label: 'Microdrenagem', value: 'MICRODRENAGEM' },
    { label: 'Conservação de Logradouros', value: 'CONSERVACAO DE LOGRADOUROS' },
  ];

  const departamentoOptions = [
    { label: 'STLP', value: 'STLP' },
    { label: 'STM', value: 'STM' },
    { label: 'STPO', value: 'STPO' },
  ];

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
                            !filters.dataInicio && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dataInicio ? (
                            format(new Date(filters.dataInicio), "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dataInicio ? new Date(filters.dataInicio) : undefined}
                          onSelect={date => 
                            onFiltersChange({ dataInicio: date ? date.toISOString().split('T')[0] : undefined })
                          }
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
                            !filters.dataFim && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dataFim ? (
                            format(new Date(filters.dataFim), "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dataFim ? new Date(filters.dataFim) : undefined}
                          onSelect={date => 
                            onFiltersChange({ dataFim: date ? date.toISOString().split('T')[0] : undefined })
                          }
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Filtro de status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <MultiSelect
                  selected={filters.status || []}
                  onChange={status => onFiltersChange({ status })}
                  options={statusOptions}
                  placeholder="Selecione os status"
                />
              </div>

              {/* Filtro de distritos */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Distritos</Label>
                <MultiSelect
                  selected={filters.distritos || []}
                  onChange={distritos => onFiltersChange({ distritos })}
                  options={distritosOptions}
                  placeholder="Selecione os distritos"
                />
              </div>

              {/* Filtro de tipos de serviço */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipos de Serviço</Label>
                <MultiSelect
                  selected={filters.tiposServico || []}
                  onChange={tiposServico => onFiltersChange({ tiposServico })}
                  options={tiposServicoOptions}
                  placeholder="Selecione os tipos de serviço"
                />
              </div>

              {/* Filtro de departamentos */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Departamentos</Label>
                <MultiSelect
                  selected={filters.departamento || []}
                  onChange={departamento => onFiltersChange({ departamento })}
                  options={departamentoOptions}
                  placeholder="Selecione os departamentos"
                />
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
                {Object.entries(chartVisibility).map(([chartName, isVisible]) => (
                  <div key={chartName} className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor={`chart-${chartName}`} className="font-medium cursor-pointer text-sm">
                      {chartName === 'districtPerformance' && 'Performance por Distrito'}
                      {chartName === 'serviceTypes' && 'Distribuição por Tipo de Serviço'}
                      {chartName === 'resolutionTime' && 'Tempo Médio de Execução'}
                      {chartName === 'responsibility' && 'Responsabilidade (Sub vs Externo)'}
                      {chartName === 'evolution' && 'Evolução de Status'}
                      {chartName === 'departmentComparison' && 'Comparação Departamental'}
                      {chartName === 'oldestPendingList' && 'Top Pendências Antigas'}
                    </Label>
                    <Switch
                      id={`chart-${chartName}`}
                      checked={isVisible}
                      onCheckedChange={(checked) => 
                        onChartVisibilityChange(chartName as keyof ChartVisibility, checked)
                      }
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                ))}
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
