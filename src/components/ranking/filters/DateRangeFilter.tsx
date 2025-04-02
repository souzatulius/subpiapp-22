
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FilterOptions } from '@/components/ranking/types';

interface DateRangeFilterProps {
  dateRange: FilterOptions['dateRange'];
  onDateRangeChange: (dateRange: FilterOptions['dateRange']) => void;
}

// Format dates as DD MMM/YY
const formatDateShort = (date: Date): string => {
  const day = format(date, "d", { locale: ptBR });
  const month = format(date, "MMM", { locale: ptBR });
  const year = format(date, "yy", { locale: ptBR });
  return `${day} ${month}/${year}`;
};

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
                  {formatDateShort(dateRange.from)} - {formatDateShort(dateRange.to)}
                </>
              ) : (
                formatDateShort(dateRange.from)
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
