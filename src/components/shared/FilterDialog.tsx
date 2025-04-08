
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterOptions {
  status?: FilterOption[];
  category?: FilterOption[];
  [key: string]: FilterOption[] | undefined;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  options?: FilterOptions;
  showDateFilter?: boolean;
  chartVisibility?: Record<string, boolean>;
  onChartVisibilityChange?: (chartId: string, visible: boolean) => void;
  onResetFilters?: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  options = {},
  showDateFilter = false,
  chartVisibility,
  onChartVisibilityChange,
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = useState<any>(filters);
  const [localChartVisibility, setLocalChartVisibility] = useState<Record<string, boolean>>(chartVisibility || {});

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);
  
  useEffect(() => {
    if (chartVisibility) {
      setLocalChartVisibility(chartVisibility);
    }
  }, [chartVisibility, open]);

  const handleCheckboxChange = (filterType: string, value: string) => {
    setLocalFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: range || { from: undefined, to: undefined }
    }));
  };

  const handleChartVisibilityChange = (chartId: string) => {
    if (onChartVisibilityChange) {
      const newVisibility = {
        ...localChartVisibility,
        [chartId]: !localChartVisibility[chartId]
      };
      setLocalChartVisibility(newVisibility);
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    
    if (onChartVisibilityChange && chartVisibility) {
      Object.entries(localChartVisibility).forEach(([chartId, isVisible]) => {
        if (chartVisibility[chartId] !== isVisible) {
          onChartVisibilityChange(chartId, isVisible);
        }
      });
    }
    
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    const resetFilters = Object.keys(localFilters).reduce((acc, key) => {
      if (Array.isArray(localFilters[key])) {
        acc[key] = [];
      } else if (key === 'dateRange') {
        acc[key] = { from: undefined, to: undefined };
      } else {
        acc[key] = undefined;
      }
      return acc;
    }, {});
    
    setLocalFilters(resetFilters);
    
    // Reset chart visibility to all visible
    if (chartVisibility && onChartVisibilityChange) {
      const resetVisibility = Object.keys(chartVisibility).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setLocalChartVisibility(resetVisibility);
    }
    
    if (onResetFilters) {
      onResetFilters();
    } else {
      onFiltersChange(resetFilters);
    }
    
    onOpenChange(false);
  };

  const hasActiveFilters = () => {
    return Object.entries(localFilters).some(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (key === 'dateRange') {
        const dateRange = value as DateRange;
        return dateRange.from || dateRange.to;
      }
      return !!value;
    });
  };

  const hasHiddenCharts = () => {
    return chartVisibility && Object.values(localChartVisibility).some(isVisible => !isVisible);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {Object.entries(options).map(([filterType, filterOptions]) => (
            <div key={filterType} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">{filterType}</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions?.map((option) => (
                  <div key={option.value} className="flex items-start space-x-2">
                    <Checkbox
                      id={`${filterType}-${option.value}`}
                      checked={(localFilters[filterType] || []).includes(option.value)}
                      onCheckedChange={() => handleCheckboxChange(filterType, option.value)}
                    />
                    <Label
                      htmlFor={`${filterType}-${option.value}`}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {showDateFilter && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Período</h3>
              <div className="grid w-full items-center gap-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !localFilters.dateRange?.from ? 'text-muted-foreground' : ''
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.dateRange?.from ? (
                        localFilters.dateRange.to ? (
                          <>
                            {format(localFilters.dateRange.from, 'dd/MM/yyyy')} -{' '}
                            {format(localFilters.dateRange.to, 'dd/MM/yyyy')}
                          </>
                        ) : (
                          format(localFilters.dateRange.from, 'dd/MM/yyyy')
                        )
                      ) : (
                        "Selecione um período"
                      )}
                      {(localFilters.dateRange?.from || localFilters.dateRange?.to) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-6 w-6 -mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateRangeChange({ from: undefined, to: undefined });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={localFilters.dateRange?.from}
                      selected={localFilters.dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          
          {/* Chart Visibility Section */}
          {chartVisibility && onChartVisibilityChange && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Visibilidade dos Gráficos</h3>
              <div className="space-y-2">
                {Object.entries(localChartVisibility).map(([chartId, isVisible]) => {
                  // Map chart IDs to readable names
                  const chartNames: Record<string, string> = {
                    'origemDemandas': 'Origem das Demandas',
                    'distribuicaoPorTemas': 'Problemas mais frequentes',
                    'tempoMedioResposta': 'Tempo Médio de Resposta',
                    'performanceArea': 'Áreas mais acionadas',
                    'notasEmitidas': 'Notas de Imprensa',
                    // Add more chart names as needed
                  };
                  
                  return (
                    <div key={chartId} className="flex items-center justify-between">
                      <Label htmlFor={`chart-${chartId}`} className="text-sm">
                        {chartNames[chartId] || chartId}
                      </Label>
                      <Checkbox
                        id={`chart-${chartId}`}
                        checked={isVisible}
                        onCheckedChange={() => handleChartVisibilityChange(chartId)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="w-full sm:w-auto"
            disabled={!hasActiveFilters() && !hasHiddenCharts()}
          >
            {hasHiddenCharts() ? "Restaurar Gráficos" : "Limpar filtros"}
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="w-full sm:w-auto"
          >
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
