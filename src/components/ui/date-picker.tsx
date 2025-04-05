import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; 
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { Label } from "./label";

export interface DatePickerProps {
  date?: Date;
  onSelect: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  showTimeSelect?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Selecione",
  className,
  showTimeSelect = false
}: DatePickerProps) {
  // Get today's date at midnight for date comparison
  const today = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const [selectedHours, setSelectedHours] = React.useState<string>(date ? format(date, 'HH') : '12');
  const [selectedMinutes, setSelectedMinutes] = React.useState<string>(date ? format(date, 'mm') : '00');

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    // Allow the user to type and validate the input
    if (type === 'hours') {
      // Validate hours (0-23)
      let hours = parseInt(value);
      if (!isNaN(hours) && hours >= 0 && hours <= 23) {
        setSelectedHours(value.padStart(2, '0'));
      } else if (value === '') {
        // Allow empty input for typing
        setSelectedHours(value);
      }
    } else {
      // Validate minutes (0-59)
      let minutes = parseInt(value);
      if (!isNaN(minutes) && minutes >= 0 && minutes <= 59) {
        setSelectedMinutes(value.padStart(2, '0'));
      } else if (value === '') {
        // Allow empty input for typing
        setSelectedMinutes(value);
      }
    }

    // Only update the date if we have a valid value and a date is selected
    if (date && (
        (type === 'hours' && !isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 23) || 
        (type === 'minutes' && !isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 59)
    )) {
      const newDate = new Date(date);
      const hoursValue = type === 'hours' ? parseInt(value) : parseInt(selectedHours || '0');
      const minutesValue = type === 'minutes' ? parseInt(value) : parseInt(selectedMinutes || '0');
      
      newDate.setHours(hoursValue, minutesValue);
      onSelect(newDate);
    }
  };

  // Handle time input blur to format correctly
  const handleTimeBlur = (type: 'hours' | 'minutes') => {
    if (type === 'hours') {
      if (selectedHours === '') {
        setSelectedHours('00');
      } else {
        setSelectedHours(selectedHours.padStart(2, '0'));
      }
    } else {
      if (selectedMinutes === '') {
        setSelectedMinutes('00');
      } else {
        setSelectedMinutes(selectedMinutes.padStart(2, '0'));
      }
    }

    // Update date with formatted time
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(
        parseInt(selectedHours || '0'),
        parseInt(selectedMinutes || '0')
      );
      onSelect(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onSelect(undefined);
      return;
    }

    if (showTimeSelect) {
      // Keep the user-selected time when changing the date
      selectedDate.setHours(
        parseInt(selectedHours || '0'), 
        parseInt(selectedMinutes || '0')
      );
    }
    
    onSelect(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-12 justify-start text-left font-normal rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-all duration-300 hover:border-gray-600",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <span>
              {format(date, showTimeSelect ? "PPP 'às' HH:mm" : "PPP", { locale: ptBR })}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => date < today}
          locale={ptBR}
          className={cn("p-3 pointer-events-auto")}
        />

        {showTimeSelect && (
          <div className="p-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Label>Horário</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  value={selectedHours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                  onBlur={() => handleTimeBlur('hours')}
                  className="w-16 text-center"
                  maxLength={2}
                />
                <span>:</span>
                <Input
                  value={selectedMinutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                  onBlur={() => handleTimeBlur('minutes')}
                  className="w-16 text-center"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
