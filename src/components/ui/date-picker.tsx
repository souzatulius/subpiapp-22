
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
 * DatePicker component
 * 
 * A full-featured date picker component with optional time selection.
 * Allows users to select dates from a calendar and optionally set a specific time.
 * 
 * The component uses the date-fns library for date manipulation and formatting,
 * and displays dates in Brazilian Portuguese format.
 * 
 * @param date - The currently selected date (or undefined if no date selected)
 * @param onSelect - Callback fired when a date is selected
 * @param placeholder - Placeholder text shown when no date is selected
 * @param className - Additional CSS classes
 * @param showTimeSelect - Whether to show time selection controls (hours/minutes)
 * @param useDropdownTimeSelect - Whether to use dropdown selects for time selection instead of text inputs
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
   * Handles changes to the time inputs (hours or minutes)
   * Validates that the input is a valid number within the appropriate range:
   * - Hours: 0-23
   * - Minutes: 0-59
   * 
   * Updates the date with the new time values when appropriate
   * 
   * @param type - Whether we're changing 'hours' or 'minutes'
   * @param value - The new input value
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

    // Only update the date if we have a valid date selected
    if (date && value !== '') {
      let hours = parseInt(selectedHours || '0', 10);
      let minutes = parseInt(selectedMinutes || '0', 10);
      
      if (type === 'hours' && value !== '') {
        hours = parseInt(value, 10);
      } else if (type === 'minutes' && value !== '') {
        minutes = parseInt(value, 10);
      }
      
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      onSelect(newDate);
    }
  };

  /**
   * Focus handler to clear the field for easier input
   * When a time field gets focus, we clear it to let the user
   * enter a new value from scratch more easily
   * 
   * @param type - Whether we're focusing on 'hours' or 'minutes'
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
   * When a time field loses focus, we ensure it has a valid
   * format (padding with zeros as needed) and update the date
   * 
   * @param type - Whether we're handling 'hours' or 'minutes' blur
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
      const newDate = new Date(date);
      newDate.setHours(
        parseInt(selectedHours || '0', 10),
        parseInt(selectedMinutes || '0', 10)
      );
      onSelect(newDate);
    }
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
      <DateTimePickerContent
        date={date}
        onSelect={onSelect}
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
