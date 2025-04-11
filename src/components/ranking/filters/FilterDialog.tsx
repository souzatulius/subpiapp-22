
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChartVisibility } from '../types';
import { ArrowDownUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartVisibility?: ChartVisibility;
  setChartVisibility?: React.Dispatch<React.SetStateAction<ChartVisibility>>;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  chartVisibility,
  setChartVisibility
}) => {
  const handleChange = (chart: keyof ChartVisibility) => {
    if (setChartVisibility && chartVisibility) {
      setChartVisibility(prev => ({ ...prev, [chart]: !prev[chart] }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Exibição de Gráficos</DialogTitle>
        </DialogHeader>
        
        {chartVisibility && setChartVisibility && (
          <div className="grid gap-4 py-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="districtPerformance" 
                  checked={chartVisibility.districtPerformance} 
                  onCheckedChange={() => handleChange('districtPerformance')}
                />
                <Label htmlFor="districtPerformance">Performance por Distrito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="resolutionTime" 
                  checked={chartVisibility.resolutionTime} 
                  onCheckedChange={() => handleChange('resolutionTime')}
                />
                <Label htmlFor="resolutionTime">Tempo de Resolução</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="evolution" 
                  checked={chartVisibility.evolution} 
                  onCheckedChange={() => handleChange('evolution')}
                />
                <Label htmlFor="evolution">Evolução</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="oldestPendingList" 
                  checked={chartVisibility.oldestPendingList} 
                  onCheckedChange={() => handleChange('oldestPendingList')}
                />
                <Label htmlFor="oldestPendingList">Pendências Mais Antigas</Label>
              </div>
            </div>
            
            <h3 className="text-sm font-medium flex items-center gap-2 mt-2">
              <PieChart className="h-4 w-4 text-orange-500" />
              Distribuição
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="serviceTypes" 
                  checked={chartVisibility.serviceTypes} 
                  onCheckedChange={() => handleChange('serviceTypes')}
                />
                <Label htmlFor="serviceTypes">Tipos de Serviço</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="responsibility" 
                  checked={chartVisibility.responsibility} 
                  onCheckedChange={() => handleChange('responsibility')}
                />
                <Label htmlFor="responsibility">Responsabilidade</Label>
              </div>
            </div>
            
            <h3 className="text-sm font-medium flex items-center gap-2 mt-2">
              <Activity className="h-4 w-4 text-orange-500" />
              Análises Avançadas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="departmentComparison" 
                  checked={chartVisibility.departmentComparison} 
                  onCheckedChange={() => handleChange('departmentComparison')}
                />
                <Label htmlFor="departmentComparison">Comparativo de Departamentos</Label>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {chartVisibility && setChartVisibility && (
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => {
                  // Reset all to true
                  const allTrue = Object.keys(chartVisibility).reduce((acc, key) => {
                    acc[key as keyof ChartVisibility] = true;
                    return acc;
                  }, {} as ChartVisibility);
                  
                  setChartVisibility(allTrue);
                }}
                className="flex items-center gap-2"
              >
                <ArrowDownUp className="h-4 w-4" />
                Mostrar Todos
              </Button>
              <Button type="button" onClick={() => onOpenChange(false)}>Aplicar</Button>
            </div>
          )}
          {!chartVisibility && (
            <Button type="button" onClick={() => onOpenChange(false)}>Fechar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
