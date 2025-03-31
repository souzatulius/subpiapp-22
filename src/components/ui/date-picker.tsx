import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; 
import { Calendar as CalendarIcon, Clock } from "lucide-react";
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

interface DatePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  showTimeSelect?: boolean;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Selecione uma data",
  className,
  showTimeSelect = false
}: DatePickerProps) {
  const [selectedHours, setSelectedHours] = React.useState<string>(date ? format(date, 'HH') : '12');
  const [selectedMinutes, setSelectedMinutes] = React.useState<string>(date ? format(date, 'mm') : '00');

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (type === 'hours') {
      const hours = parseInt(value);
      if (!isNaN(hours) && hours >= 0 && hours <= 23) {
        setSelectedHours(value.padStart(2, '0'));
      }
    } else {
      const minutes = parseInt(value);
      if (!isNaN(minutes) && minutes >= 0 && minutes <= 59) {
        setSelectedMinutes(value.padStart(2, '0'));
      }
    }

    // Update the date with the new time
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(
        type === 'hours' ? parseInt(value) : parseInt(selectedHours),
        type === 'minutes' ? parseInt(value) : parseInt(selectedMinutes)
      );
      setDate(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    if (showTimeSelect) {
      // Keep the user-selected time when changing the date
      selectedDate.setHours(parseInt(selectedHours), parseInt(selectedMinutes));
    }
    
    setDate(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
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
                  className="w-16 text-center"
                  maxLength={2}
                />
                <span>:</span>
                <Input
                  value={selectedMinutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
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
