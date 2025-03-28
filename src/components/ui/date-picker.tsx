
import * as React from "react";
import { format, isValid, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  locale?: any;
  showTimeSelect?: boolean;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Selecione a data",
  className,
  locale,
  showTimeSelect = false,
}: DatePickerProps) {
  // Ensure date is valid before formatting
  const isDateValid = date && isValid(date);
  
  // Generate hours options (06-22)
  const hoursOptions = Array.from({ length: 17 }, (_, i) => i + 6);
  
  // Generate minutes options (00, 30)
  const minutesOptions = [0, 30];
  
  // Handle time change
  const handleHourChange = (value: string) => {
    if (!isDateValid) return;
    
    const newDate = setHours(date!, parseInt(value, 10));
    setDate(newDate);
  };
  
  const handleMinuteChange = (value: string) => {
    if (!isDateValid) return;
    
    const newDate = setMinutes(date!, parseInt(value, 10));
    setDate(newDate);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !isDateValid && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isDateValid ? (
              format(date, "dd/MM/yyyy", { locale })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={isDateValid ? date : undefined}
            onSelect={setDate}
            initialFocus
            locale={locale}
            className="p-3 pointer-events-auto"
            captionLayout="dropdown-buttons"
            fromYear={1940}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
      
      {showTimeSelect && isDateValid && (
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
          </div>
          <Select
            value={isDateValid ? date.getHours().toString() : "12"}
            onValueChange={handleHourChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              {hoursOptions.map((hour) => (
                <SelectItem 
                  key={hour} 
                  value={hour.toString()}
                >
                  {hour.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="mx-1">:</span>
          
          <Select
            value={isDateValid ? (Math.floor(date.getMinutes() / 30) * 30).toString() : "0"}
            onValueChange={handleMinuteChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutesOptions.map((minute) => (
                <SelectItem 
                  key={minute} 
                  value={minute.toString()}
                >
                  {minute.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
