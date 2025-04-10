
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
import { ChartVisibility } from './types';

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
                Ative ou desative a exibição dos gráficos no painel. Você poderá reativá-los a qualquer momento.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {Object.keys(chartVisibility).map((chartName) => (
                  <div key={chartName} className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor={`chart-${chartName}`} className="font-medium cursor-pointer text-sm">
                      {getChartDisplayName(chartName)}
                    </Label>
                    <Switch
                      id={`chart-${chartName}`}
                      checked={chartVisibility[chartName as keyof ChartVisibility]}
                      onCheckedChange={() => handleToggleChart(chartName as keyof ChartVisibility)}
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
            <Button variant="outline" onClick={resetVisibility} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
            <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
              Aplicar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to convert camelCase chart keys to display names
function getChartDisplayName(chartName: string): string {
  switch (chartName) {
    case 'districtPerformance':
      return 'Performance por Distrito';
    case 'serviceTypes':
      return 'Distribuição por Tipo de Serviço';
    case 'resolutionTime':
      return 'Tempo Médio de Execução';
    case 'responsibility':
      return 'Responsabilidade (Sub vs Externo)';
    case 'evolution':
      return 'Evolução de Status';
    case 'departmentComparison':
      return 'Comparação Departamental';
    case 'oldestPendingList':
      return 'Top Pendências Antigas';
    case 'statusDistribution':
      return 'Distribuição de Status';
    case 'topCompanies':
      return 'Top Empresas';
    case 'districtDistribution':
      return 'Distribuição por Distrito';
    default:
      return chartName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}

export default FilterDialog;
