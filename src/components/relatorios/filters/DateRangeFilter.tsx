
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FilterOptions } from '@/components/relatorios/types';

interface DateRangeFilterProps {
  dateRange: FilterOptions['dateRange'];
  onDateRangeChange: (dateRange: FilterOptions['dateRange']) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onDateRangeChange }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>Período</Label>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'PP', { locale: ptBR })} -{' '}
                  {format(dateRange.to, 'PP', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'PP', { locale: ptBR })
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
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
