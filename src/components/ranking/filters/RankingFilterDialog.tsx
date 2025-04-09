
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
import { Filter, LayoutDashboard, RotateCw } from 'lucide-react';
import { ChartVisibility } from '@/types/ranking';
import DateRangeFilter from './DateRangeFilter';

interface RankingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartVisibility: ChartVisibility;
  onToggleChartVisibility: (chartId: string, isVisible: boolean) => void;
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
            <div className="grid grid-cols-1 gap-3">
              <h3 className="font-medium text-gray-700">Visibilidade de gráficos</h3>
              <div className="bg-orange-50 p-4 rounded-md text-orange-800 text-sm">
                Ative ou desative a exibição dos gráficos no painel. Você poderá reativá-los a qualquer momento.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {Object.entries(chartVisibility).map(([chartName, isVisible]) => (
                  <div key={chartName} className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor={`chart-${chartName}`} className="font-medium cursor-pointer text-sm">
                      {chartName === 'evServ' && 'Evolução de Serviços em Andamento'}
                      {chartName === 'serviceDistribution' && 'Distribuição por Serviço'}
                      {chartName === 'executionTime' && 'Prazo de Execução'}
                      {chartName === 'districtsWronglyIncluded' && 'Distritos Incluídos Indevidamente'}
                      {chartName === 'compByArea' && 'Comparação por Áreas Técnicas'}
                      {chartName === 'top10OldestPending' && 'Top 10 Pendências Mais Antigas'}
                      {chartName === 'bottlenecks' && 'Gargalos e Problemas'}
                      {chartName === 'idealRanking' && 'Como Estaria Nosso Ranking'}
                      {chartName === 'sgzRanking' && 'SGZ x Ranking das Subs'}
                      {chartName === 'attentionPoints' && 'Pontos de Atenção'}
                    </Label>
                    <Switch
                      id={`chart-${chartName}`}
                      checked={isVisible}
                      onCheckedChange={(checked) => 
                        onToggleChartVisibility(chartName, checked)
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
