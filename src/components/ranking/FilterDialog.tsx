
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Filter, LayoutDashboard, RotateCcw } from 'lucide-react';
import { ChartVisibility } from '@/components/ranking/types';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chartVisibility: ChartVisibility;
  setChartVisibility: React.Dispatch<React.SetStateAction<ChartVisibility>>;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  chartVisibility,
  setChartVisibility
}) => {
  // Toggle individual chart visibility
  const handleToggleChart = (chartName: keyof ChartVisibility) => {
    setChartVisibility(prevState => ({
      ...prevState,
      [chartName]: !prevState[chartName]
    }));
  };

  // Reset all charts to visible
  const resetVisibility = () => {
    const resetVisibility = Object.keys(chartVisibility).reduce((acc, key) => {
      acc[key as keyof ChartVisibility] = true;
      return acc;
    }, {} as ChartVisibility);
    
    setChartVisibility(resetVisibility);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
              Visualização de Gráficos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visibility" className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <h3 className="font-medium text-gray-700">Visibilidade de gráficos</h3>
              <div className="bg-orange-50 p-4 rounded-md text-orange-800 text-sm">
                Ative ou desative a exibição de gráficos conforme suas necessidades de análise.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="district-performance"
                    checked={chartVisibility.districtPerformance}
                    onCheckedChange={() => handleToggleChart('districtPerformance')}
                  />
                  <Label htmlFor="district-performance">Performance por Distrito</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="service-types"
                    checked={chartVisibility.serviceTypes}
                    onCheckedChange={() => handleToggleChart('serviceTypes')}
                  />
                  <Label htmlFor="service-types">Tipos de Serviço</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="resolution-time"
                    checked={chartVisibility.resolutionTime}
                    onCheckedChange={() => handleToggleChart('resolutionTime')}
                  />
                  <Label htmlFor="resolution-time">Tempo de Resolução</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="responsibility"
                    checked={chartVisibility.responsibility}
                    onCheckedChange={() => handleToggleChart('responsibility')}
                  />
                  <Label htmlFor="responsibility">Responsabilidade</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="evolution"
                    checked={chartVisibility.evolution}
                    onCheckedChange={() => handleToggleChart('evolution')}
                  />
                  <Label htmlFor="evolution">Evolução de Demandas</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="department-comparison"
                    checked={chartVisibility.departmentComparison}
                    onCheckedChange={() => handleToggleChart('departmentComparison')}
                  />
                  <Label htmlFor="department-comparison">Comparativo de Departamentos</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="oldest-pending"
                    checked={chartVisibility.oldestPendingList}
                    onCheckedChange={() => handleToggleChart('oldestPendingList')}
                  />
                  <Label htmlFor="oldest-pending">Demandas Mais Antigas</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status-distribution"
                    checked={chartVisibility.statusDistribution}
                    onCheckedChange={() => handleToggleChart('statusDistribution')}
                  />
                  <Label htmlFor="status-distribution">Distribuição por Status</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="service-diversity"
                    checked={chartVisibility.serviceDiversity}
                    onCheckedChange={() => handleToggleChart('serviceDiversity')}
                  />
                  <Label htmlFor="service-diversity">Diversidade de Serviços</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="time-comparison"
                    checked={chartVisibility.timeComparison}
                    onCheckedChange={() => handleToggleChart('timeComparison')}
                  />
                  <Label htmlFor="time-comparison">Comparativo de Tempo</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status-transition"
                    checked={chartVisibility.statusTransition}
                    onCheckedChange={() => handleToggleChart('statusTransition')}
                  />
                  <Label htmlFor="status-transition">Transição de Status</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={resetVisibility}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrão
          </Button>
          <Button onClick={onClose}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
