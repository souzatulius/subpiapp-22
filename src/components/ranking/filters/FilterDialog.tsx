
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, BarChart, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterOptions, ChartVisibility } from '../types';
import DateRangeFilter from './DateRangeFilter';
import StatusFilter from './StatusFilter';
import ServiceTypeFilter from './ServiceTypeFilter';
import DistrictFilter from './DistrictFilter';
import ActiveFilters from './ActiveFilters';
import ChartVisibilityManager from './ChartVisibilityManager';
import { motion } from 'framer-motion';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  chartVisibility: ChartVisibility;
  onChartVisibilityChange: (visibility: Partial<ChartVisibility>) => void;
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
  const [activeTab, setActiveTab] = useState('filtros');

  const handleDateRangeChange = (range: any) => {
    onFiltersChange({ dateRange: range });
  };
  
  const handleStatusChange = (status: string) => {
    let newStatuses = [...filters.statuses];
    
    if (status === 'Todos') {
      newStatuses = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newStatuses = newStatuses.filter(s => s !== 'Todos');
      
      // Adiciona ou remove o status
      if (newStatuses.includes(status as any)) {
        newStatuses = newStatuses.filter(s => s !== status);
      } else {
        newStatuses.push(status as any);
      }
      
      // Se não houver nenhum status, adiciona 'Todos'
      if (newStatuses.length === 0) {
        newStatuses = ['Todos'];
      }
    }
    
    onFiltersChange({ statuses: newStatuses as any });
  };
  
  const handleServiceTypeChange = (type: string) => {
    let newTypes = [...filters.serviceTypes];
    
    if (type === 'Todos') {
      newTypes = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newTypes = newTypes.filter(t => t !== 'Todos');
      
      // Adiciona ou remove o tipo
      if (newTypes.includes(type as any)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type as any);
      }
      
      // Se não houver nenhum tipo, adiciona 'Todos'
      if (newTypes.length === 0) {
        newTypes = ['Todos'];
      }
    }
    
    onFiltersChange({ serviceTypes: newTypes as any });
  };
  
  const handleDistrictChange = (district: string) => {
    let newDistricts = [...filters.districts];
    
    if (district === 'Todos') {
      newDistricts = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newDistricts = newDistricts.filter(d => d !== 'Todos');
      
      // Adiciona ou remove o distrito
      if (newDistricts.includes(district as any)) {
        newDistricts = newDistricts.filter(d => d !== district);
      } else {
        newDistricts.push(district as any);
      }
      
      // Se não houver nenhum distrito, adiciona 'Todos'
      if (newDistricts.length === 0) {
        newDistricts = ['Todos'];
      }
    }
    
    onFiltersChange({ districts: newDistricts as any });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4 pb-2 border-b">
          <SheetTitle className="text-orange-700 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filtros e Gerenciamento de Visualização
          </SheetTitle>
          <SheetDescription>
            Configure os filtros para análise e selecione quais gráficos deseja visualizar
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="filtros" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6 bg-orange-50">
            <TabsTrigger 
              value="filtros"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </TabsTrigger>
            <TabsTrigger 
              value="graficos"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Gráficos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="filtros" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateRangeFilter 
                dateRange={filters.dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
              
              <StatusFilter
                statuses={filters.statuses}
                onStatusChange={handleStatusChange}
              />
              
              <ServiceTypeFilter
                serviceTypes={filters.serviceTypes}
                onServiceTypeChange={handleServiceTypeChange}
              />
              
              <DistrictFilter
                districts={filters.districts}
                onDistrictChange={handleDistrictChange}
              />
            </div>
            
            <ActiveFilters
              filters={filters}
              onDateRangeClear={() => onFiltersChange({ dateRange: undefined })}
              onStatusChange={handleStatusChange}
              onServiceTypeChange={handleServiceTypeChange}
              onDistrictChange={handleDistrictChange}
              onClearAllFilters={onResetFilters}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  onResetFilters();
                  onOpenChange(false);
                }} 
                className="bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar Filtros e Fechar
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="graficos">
            <ChartVisibilityManager
              chartVisibility={chartVisibility}
              onChartVisibilityToggle={(chart, isVisible) => {
                const update = { [chart]: isVisible } as Partial<ChartVisibility>;
                onChartVisibilityChange(update);
              }}
            />
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => onOpenChange(false)} 
                variant="outline" 
                className="border-orange-300"
              >
                Fechar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDialog;
