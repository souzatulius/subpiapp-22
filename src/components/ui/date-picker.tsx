
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; 
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateTimePickerContent } from "./date-picker/date-time-picker-content";

export interface DatePickerProps {
  date?: Date;
  onSelect: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  showTimeSelect?: boolean;
  useDropdownTimeSelect?: boolean;
}

/**
 * DatePicker component with time selection capability
 */
export function DatePicker({
  date,
  onSelect,
  placeholder = "Selecione",
  className,
  showTimeSelect = false,
  useDropdownTimeSelect = false
}: DatePickerProps) {
  // Get today's date at midnight for date comparison
  const today = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  // Track time input values separately for better input control
  const [selectedHours, setSelectedHours] = React.useState<string>(date ? format(date, 'HH') : '12');
  const [selectedMinutes, setSelectedMinutes] = React.useState<string>(date ? format(date, 'mm') : '00');

  // Update time states when date prop changes
  React.useEffect(() => {
    if (date) {
      setSelectedHours(format(date, 'HH'));
      setSelectedMinutes(format(date, 'mm'));
    }
  }, [date]);

  /**
   * Handles date selection from the calendar
   * Preserves the currently selected time when changing dates
   */
  const handleDateSelect = (newDate?: Date) => {
    if (!newDate) {
      onSelect(undefined);
      return;
    }

    // When a new date is selected, preserve the current time
    const hours = parseInt(selectedHours || '12', 10);
    const minutes = parseInt(selectedMinutes || '00', 10);
    
    // Create new date instance to avoid modifying the original date
    const dateWithTime = new Date(newDate);
    
    // Set hours and minutes, preserving the date part
    dateWithTime.setHours(hours);
    dateWithTime.setMinutes(minutes);
    
    // Call the parent's onSelect with the new date that has the preserved time
    onSelect(dateWithTime);
  };

  /**
   * Handles changes to the time inputs (hours or minutes)
   */
  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    // Handle the input changes
    if (type === 'hours') {
      // For valid numeric values or empty string
      if (value === '' || (value.match(/^\d+$/) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
        setSelectedHours(value);
      }
    } else {
      // For valid numeric values or empty string
      if (value === '' || (value.match(/^\d+$/) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
        setSelectedMinutes(value);
      }
    }

    // Only update the date if we have a valid date selected and valid input
    if (date && value !== '') {
      // Get current hours and minutes, will be updated based on type
      let hours = parseInt(type === 'hours' ? value : selectedHours, 10);
      let minutes = parseInt(type === 'minutes' ? value : selectedMinutes, 10);
      
      // Validate to ensure we have valid numbers
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(date);
        newDate.setHours(hours, minutes);
        onSelect(newDate);
      }
    }
  };

  /**
   * Focus handler to clear the field for easier input
   */
  const handleFocus = (type: 'hours' | 'minutes') => {
    if (type === 'hours') {
      setSelectedHours('');
    } else {
      setSelectedMinutes('');
    }
  };

  /**
   * Handle time input blur to format correctly
   */
  const handleTimeBlur = (type: 'hours' | 'minutes') => {
    if (type === 'hours') {
      if (selectedHours === '') {
        setSelectedHours('00');
      } else {
        const numValue = parseInt(selectedHours, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 23) {
          setSelectedHours(numValue.toString().padStart(2, '0'));
        } else {
          setSelectedHours('00');
        }
      }
    } else {
      if (selectedMinutes === '') {
        setSelectedMinutes('00');
      } else {
        const numValue = parseInt(selectedMinutes, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
          setSelectedMinutes(numValue.toString().padStart(2, '0'));
        } else {
          setSelectedMinutes('00');
        }
      }
    }

    // Update date with formatted time
    if (date) {
      const hours = parseInt(selectedHours || '0', 10);
      const minutes = parseInt(selectedMinutes || '0', 10);
      
      // Validate to ensure we have valid numbers
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(date);
        newDate.setHours(hours, minutes);
        onSelect(newDate);
      }
    }
  };

  // Format the date for display with proper locale
  const formattedDate = date 
    ? format(date, showTimeSelect ? "PPP 'às' HH:mm" : "PPP", { locale: ptBR })
    : placeholder;

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
          <span>{formattedDate}</span>
        </Button>
      </PopoverTrigger>
      <DateTimePickerContent
        date={date}
        onSelect={handleDateSelect}
        showTimeSelect={showTimeSelect}
        selectedHours={selectedHours}
        selectedMinutes={selectedMinutes}
        onHoursChange={(value) => handleTimeChange('hours', value)}
        onMinutesChange={(value) => handleTimeChange('minutes', value)}
        onHoursFocus={() => handleFocus('hours')}
        onMinutesFocus={() => handleFocus('minutes')}
        onHoursBlur={() => handleTimeBlur('hours')}
        onMinutesBlur={() => handleTimeBlur('minutes')}
        today={today}
        useDropdownTimeSelect={useDropdownTimeSelect}
      />
    </Popover>
  );
}
