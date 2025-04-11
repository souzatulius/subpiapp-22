
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
import { Filter, LayoutDashboard, ActivitySquare, MapPin, Network } from 'lucide-react';
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

export default RankingFilterDialog;
