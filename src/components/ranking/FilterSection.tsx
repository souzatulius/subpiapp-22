
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronDown, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FilterOptions, ChartVisibility } from './types';

interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  chartVisibility: ChartVisibility;
  onChartVisibilityChange: (visibility: Partial<ChartVisibility>) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  chartVisibility,
  onChartVisibilityChange
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
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
  
  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      statuses: ['Todos'],
      serviceTypes: ['Todos'],
      districts: ['Todos']
    });
  };
  
  const handleChartVisibilityToggle = (chart: keyof ChartVisibility) => {
    onChartVisibilityChange({ 
      [chart]: !chartVisibility[chart] 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros e Gerenciamento de Exibição</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtro de Período */}
            <div className="space-y-2">
              <Label>Período</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, 'PP', { locale: ptBR })} -{' '}
                          {format(filters.dateRange.to, 'PP', { locale: ptBR })}
                        </>
                      ) : (
                        format(filters.dateRange.from, 'PP', { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    locale={ptBR}
                    mode="range"
                    defaultMonth={new Date()}
                    selected={filters.dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Filtro de Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <div className="space-y-1 p-1">
                    {['Todos', 'Planejar', 'Novo', 'Aprovado', 'Concluído'].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`status-${status}`} 
                          checked={filters.statuses.includes(status as any)}
                          onCheckedChange={() => handleStatusChange(status)}
                        />
                        <label 
                          htmlFor={`status-${status}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de Tipo de Serviço */}
            <div className="space-y-2">
              <Label>Tipo de Serviço</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por serviço" />
                </SelectTrigger>
                <SelectContent>
                  <div className="space-y-1 p-1">
                    {['Todos', 'Tapa Buraco', 'Poda', 'Limpeza'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={filters.serviceTypes.includes(type as any)}
                          onCheckedChange={() => handleServiceTypeChange(type)}
                        />
                        <label 
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de Distrito */}
            <div className="space-y-2">
              <Label>Distrito</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <div className="space-y-1 p-1">
                    {['Todos', 'Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'].map((district) => (
                      <div key={district} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`district-${district}`} 
                          checked={filters.districts.includes(district as any)}
                          onCheckedChange={() => handleDistrictChange(district)}
                        />
                        <label 
                          htmlFor={`district-${district}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {district}
                        </label>
                      </div>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filtros ativos */}
          <div className="flex flex-wrap gap-2">
            {filters.dateRange?.from && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Período: </span>
                {format(filters.dateRange.from, 'dd/MM/yyyy')}
                {filters.dateRange.to && ` - ${format(filters.dateRange.to, 'dd/MM/yyyy')}`}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onFiltersChange({ dateRange: undefined })}
                >
                  ✕
                </Button>
              </Badge>
            )}
            
            {filters.statuses[0] !== 'Todos' && filters.statuses.map(status => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                <span>Status: {status}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleStatusChange(status)}
                >
                  ✕
                </Button>
              </Badge>
            ))}
            
            {filters.serviceTypes[0] !== 'Todos' && filters.serviceTypes.map(type => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                <span>Serviço: {type}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleServiceTypeChange(type)}
                >
                  ✕
                </Button>
              </Badge>
            ))}
            
            {filters.districts[0] !== 'Todos' && filters.districts.map(district => (
              <Badge key={district} variant="secondary" className="flex items-center gap-1">
                <span>Distrito: {district}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleDistrictChange(district)}
                >
                  ✕
                </Button>
              </Badge>
            ))}
            
            {(filters.dateRange?.from || 
              filters.statuses[0] !== 'Todos' || 
              filters.serviceTypes[0] !== 'Todos' || 
              filters.districts[0] !== 'Todos') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
              >
                Limpar filtros
              </Button>
            )}
          </div>
          
          {/* Gerenciamento de gráficos */}
          <div>
            <Label className="mb-2 block">Gerenciamento de Exibição</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="chart-occurrences" 
                  checked={chartVisibility.occurrences}
                  onCheckedChange={() => handleChartVisibilityToggle('occurrences')}
                />
                <label 
                  htmlFor="chart-occurrences"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Ocorrências
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="chart-resolutionTime" 
                  checked={chartVisibility.resolutionTime}
                  onCheckedChange={() => handleChartVisibilityToggle('resolutionTime')}
                />
                <label 
                  htmlFor="chart-resolutionTime"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Tempo de Resolução
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="chart-serviceTypes" 
                  checked={chartVisibility.serviceTypes}
                  onCheckedChange={() => handleChartVisibilityToggle('serviceTypes')}
                />
                <label 
                  htmlFor="chart-serviceTypes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Tipos de Serviços
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="chart-neighborhoods" 
                  checked={chartVisibility.neighborhoods}
                  onCheckedChange={() => handleChartVisibilityToggle('neighborhoods')}
                />
                <label 
                  htmlFor="chart-neighborhoods"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Bairros
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="chart-frequentServices" 
                  checked={chartVisibility.frequentServices}
                  onCheckedChange={() => handleChartVisibilityToggle('frequentServices')}
                />
                <label 
                  htmlFor="chart-frequentServices"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Serviços Frequentes
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="chart-statusDistribution" 
                  checked={chartVisibility.statusDistribution}
                  onCheckedChange={() => handleChartVisibilityToggle('statusDistribution')}
                />
                <label 
                  htmlFor="chart-statusDistribution"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Status
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
