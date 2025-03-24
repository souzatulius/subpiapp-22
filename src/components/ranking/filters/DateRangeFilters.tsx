
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeFiltersProps {
  dataInicio?: Date;
  dataFim?: Date;
  onDateChange: (field: 'dataInicio' | 'dataFim', date?: Date) => void;
}

const DateRangeFilters: React.FC<DateRangeFiltersProps> = ({
  dataInicio,
  dataFim,
  onDateChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dataInicio && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataInicio ? format(dataInicio, 'PP', { locale: ptBR }) : <span>Selecione a data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dataInicio}
              onSelect={(date) => onDateChange('dataInicio', date)}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dataFim && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataFim ? format(dataFim, 'PP', { locale: ptBR }) : <span>Selecione a data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dataFim}
              onSelect={(date) => onDateChange('dataFim', date)}
              initialFocus
              locale={ptBR}
              disabled={(date) => dataInicio ? date < dataInicio : false}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeFilters;
