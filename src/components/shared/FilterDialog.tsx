
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
  options: FilterOptions;
  showDateFilter?: boolean;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  options,
  showDateFilter = false
}) => {
  const [localFilters, setLocalFilters] = useState<any>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

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

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
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
    onFiltersChange(resetFilters);
    onOpenChange(false);
  };

  const hasActiveFilters = () => {
    return Object.entries(localFilters).some(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (key === 'dateRange') {
        return value.from || value.to;
      }
      return !!value;
    });
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
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="w-full sm:w-auto"
            disabled={!hasActiveFilters()}
          >
            Limpar filtros
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
