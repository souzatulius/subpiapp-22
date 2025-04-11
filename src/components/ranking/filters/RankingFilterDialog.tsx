
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
import { Filter, LayoutDashboard, ActivitySquare, MapPin, Network, EyeOff } from 'lucide-react';
import { ChartVisibility } from '@/types/ranking';
import DateRangeFilter from './DateRangeFilter';

interface RankingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartVisibility?: ChartVisibility;
  onToggleChartVisibility?: (chartId: string) => void;
}

const RankingFilterDialog: React.FC<RankingFilterDialogProps> = ({
  open,
  onOpenChange,
  chartVisibility,
  onToggleChartVisibility,
}) => {
  // Get all hidden charts
  const hiddenCharts = chartVisibility ? 
    Object.entries(chartVisibility)
      .filter(([key, visible]) => !visible && !key.startsWith('__')) // Filter out hidden charts and special properties
      : [];
  
  const handleRestoreAll = () => {
    if (chartVisibility && onToggleChartVisibility) {
      Object.keys(chartVisibility).forEach(key => {
        if (!chartVisibility[key]) {
          onToggleChartVisibility(key);
        }
      });
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

        <Tabs defaultValue="visibility">
          <TabsList className="w-full mb-6 bg-orange-50">
            <TabsTrigger value="visibility" className="flex-1">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Visualização
            </TabsTrigger>
            
            {hiddenCharts.length > 0 && (
              <TabsTrigger value="hidden" className="flex-1">
                <EyeOff className="h-4 w-4 mr-2" />
                Gráficos Ocultos ({hiddenCharts.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="visibility" className="space-y-6">
            {chartVisibility && (
              <>
                <div className="grid grid-cols-1 gap-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <ActivitySquare className="h-4 w-4 mr-2 text-orange-600" />
                    Performance e Eficiência
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-statusDistribution" className="font-medium cursor-pointer text-sm">
                        Distribuição por Status (SGZ)
                      </Label>
                      <Switch
                        id="chart-statusDistribution"
                        checked={chartVisibility.statusDistribution}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('statusDistribution')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-statusTransition" className="font-medium cursor-pointer text-sm">
                        Status de Atendimento (Painel da Zeladoria)
                      </Label>
                      <Switch
                        id="chart-statusTransition"
                        checked={chartVisibility.statusTransition}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('statusTransition')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-districtEfficiencyRadar" className="font-medium cursor-pointer text-sm">
                        Radar de Eficiência por Distrito (SGZ)
                      </Label>
                      <Switch
                        id="chart-districtEfficiencyRadar"
                        checked={chartVisibility.districtEfficiencyRadar}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('districtEfficiencyRadar')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-resolutionTime" className="font-medium cursor-pointer text-sm">
                        Tempo Médio por Status (SGZ)
                      </Label>
                      <Switch
                        id="chart-resolutionTime"
                        checked={chartVisibility.resolutionTime}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('resolutionTime')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                    Territórios e Serviços
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-districtPerformance" className="font-medium cursor-pointer text-sm">
                        Ordens por Distrito (SGZ)
                      </Label>
                      <Switch
                        id="chart-districtPerformance"
                        checked={chartVisibility.districtPerformance}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('districtPerformance')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-serviceTypes" className="font-medium cursor-pointer text-sm">
                        Tipos de Serviço Mais Frequentes
                      </Label>
                      <Switch
                        id="chart-serviceTypes"
                        checked={chartVisibility.serviceTypes}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('serviceTypes')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-oldestPendingList" className="font-medium cursor-pointer text-sm">
                        Tempo de Abertura das OS
                      </Label>
                      <Switch
                        id="chart-oldestPendingList"
                        checked={chartVisibility.oldestPendingList}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('oldestPendingList')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Network className="h-4 w-4 mr-2 text-orange-600" />
                    Fluxos Críticos
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-responsibility" className="font-medium cursor-pointer text-sm">
                        Impacto dos Terceiros (SGZ)
                      </Label>
                      <Switch
                        id="chart-responsibility"
                        checked={chartVisibility.responsibility}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('responsibility')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="chart-sgzPainel" className="font-medium cursor-pointer text-sm">
                        Comparativo SGZ vs Painel
                      </Label>
                      <Switch
                        id="chart-sgzPainel"
                        checked={chartVisibility.sgzPainel}
                        onCheckedChange={() => 
                          onToggleChartVisibility?.('sgzPainel')
                        }
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Hidden Charts Tab */}
          <TabsContent value="hidden" className="space-y-6">
            {hiddenCharts.length > 0 ? (
              <>
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium text-gray-700">Gráficos Ocultos</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRestoreAll}
                    className="text-xs text-blue-600 hover:text-blue-800 border-blue-200"
                  >
                    Restaurar todos
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hiddenCharts.map(([chartId]) => (
                    <div key={chartId} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <Label className="font-medium text-sm text-gray-600">
                        {getChartName(chartId)}
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleChartVisibility?.(chartId)}
                        className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        Restaurar
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Não há gráficos ocultos no momento
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <div className="flex items-center gap-2">
            <Button onClick={() => onOpenChange(false)} className="bg-orange-500 hover:bg-orange-600">
              Aplicar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get a human-readable name for chart IDs
const getChartName = (chartId: string): string => {
  const names: Record<string, string> = {
    districtPerformance: "Ordens por Distrito (SGZ)",
    serviceTypes: "Tipos de Serviço Mais Frequentes",
    resolutionTime: "Tempo Médio por Status",
    responsibility: "Impacto dos Terceiros",
    statusDistribution: "Distribuição por Status",
    statusTransition: "Status de Atendimento",
    districtEfficiencyRadar: "Radar de Eficiência por Distrito",
    sgzPainel: "Comparativo SGZ vs Painel",
    oldestPendingList: "Tempo de Abertura das OS",
    evolution: "Evolução",
    departmentComparison: "Comparativo de Departamentos",
    topCompanies: "Top Empresas",
    districtDistribution: "Distribuição por Distrito",
    servicesByDepartment: "Serviços por Departamento",
    servicesByDistrict: "Serviços por Distrito",
    timeComparison: "Comparação de Tempo",
    dailyDemands: "Demandas Diárias",
    closureTime: "Tempo de Fechamento",
    neighborhoodComparison: "Comparativo de Bairros",
    externalDistricts: "Distritos Externos",
    efficiencyImpact: "Impacto de Eficiência",
    criticalStatus: "Status Crítico",
    serviceDiversity: "Diversidade de Serviços"
  };
  
  return names[chartId] || chartId;
};

export default RankingFilterDialog;
