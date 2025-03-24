
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FilterOptions } from '@/components/ranking/types';
import { DateRange as DayPickerDateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  dateRange: FilterOptions['dateRange'];
  onDateRangeChange: (dateRange: FilterOptions['dateRange']) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onDateRangeChange }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Convert our DateRange to react-day-picker's DateRange
  const convertToDayPickerDateRange = (range?: FilterOptions['dateRange']): DayPickerDateRange | undefined => {
    if (!range) return undefined;
    
    // Ensure we're working with Date objects
    const from = range.from ? new Date(range.from) : undefined;
    const to = range.to ? new Date(range.to) : undefined;
    
    if (!from) return undefined;
    
    return {
      from,
      to
    };
  };

  // Format date for display
  const formatDateDisplay = (date: Date | string | null | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'PP', { locale: ptBR });
  };

  // Handle date selection from the calendar
  const handleDateRangeChange = (range: DayPickerDateRange | undefined) => {
    if (!range) {
      onDateRangeChange(undefined);
      return;
    }
    
    onDateRangeChange({
      from: range.from,
      to: range.to
    });
  };

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
                  {formatDateDisplay(dateRange.from)} -{' '}
                  {formatDateDisplay(dateRange.to)}
                </>
              ) : (
                formatDateDisplay(dateRange.from)
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
            defaultMonth={dateRange?.from ? new Date(dateRange.from) : new Date()}
            selected={convertToDayPickerDateRange(dateRange)}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
