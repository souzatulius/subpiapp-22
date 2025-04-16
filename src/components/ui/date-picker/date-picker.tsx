
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; 
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { DateTimePickerContent } from "./date-time-picker-content";
import { DatePickerProps } from "./date-picker-types";
import { formatTimeValue, createDateWithTime } from "./time-input-handler";

/**
 * DatePicker component with time selection capability
 * 
 * Allows selection of dates with optional time selection using either
 * text inputs or dropdown selectors
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

  // Update time states when date prop changes - BUT ONLY when component mounts or date reference changes
  // This avoids re-setting hours/minutes when user selects new values from dropdowns
  React.useEffect(() => {
    if (date) {
      console.log("DatePicker: Initial date received:", date.toISOString());
      console.log("DatePicker: Setting initial hours/minutes from date:", format(date, 'HH'), format(date, 'mm'));
      setSelectedHours(format(date, 'HH'));
      setSelectedMinutes(format(date, 'mm'));
    }
  }, []);  // Only run on mount, not when date changes

  /**
   * Handles date selection from the calendar
   * Preserves the currently selected time when changing dates
   */
  const handleDateSelect = (newDate?: Date) => {
    if (!newDate) {
      console.log("DatePicker: Date cleared");
      onSelect(undefined);
      return;
    }

    // Important: Create a new date to avoid reference issues
    const selectedDate = new Date(newDate);
    console.log("DatePicker: New date selected from calendar:", selectedDate.toISOString());
    
    // When a new date is selected, preserve the current hours/minutes values
    const hours = parseInt(selectedHours, 10);
    const minutes = parseInt(selectedMinutes, 10);
    
    console.log("DatePicker: Preserving time values:", hours, minutes);
    
    // Create new date instance with time preserved
    const dateWithTime = createDateWithTime(selectedDate, hours, minutes);
    console.log("DatePicker: Final date with preserved time:", dateWithTime.toISOString());
    
    // Call the parent's onSelect with the new date that has the preserved time
    onSelect(dateWithTime);
  };

  /**
   * Handles changes to the time inputs (hours or minutes)
   */
  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    console.log(`DatePicker: Time ${type} changed to:`, value);
    
    // Handle the input changes
    if (type === 'hours') {
      setSelectedHours(value);
    } else {
      setSelectedMinutes(value);
    }

    // Only update the date if we have a valid date selected and valid input
    if (date && value !== '') {
      // Get current hours and minutes, will be updated based on type
      let hours = parseInt(type === 'hours' ? value : selectedHours, 10);
      let minutes = parseInt(type === 'minutes' ? value : selectedMinutes, 10);
      
      // Validate to ensure we have valid numbers
      if (!isNaN(hours) && !isNaN(minutes)) {
        // Create a new date object to avoid mutations
        const newDate = createDateWithTime(new Date(date), hours, minutes);
        console.log(`DatePicker: Time changed, updating date to:`, newDate.toISOString());
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
      setSelectedHours(formatTimeValue(selectedHours, 'hours'));
    } else {
      setSelectedMinutes(formatTimeValue(selectedMinutes, 'minutes'));
    }

    // Update date with formatted time
    if (date) {
      const hours = parseInt(selectedHours || '0', 10);
      const minutes = parseInt(selectedMinutes || '0', 10);
      
      // Validate to ensure we have valid numbers
      if (!isNaN(hours) && !isNaN(minutes)) {
        // Create a new date object to avoid mutations
        const newDate = createDateWithTime(new Date(date), hours, minutes);
        console.log("DatePicker: Time blur, updated date:", newDate.toISOString());
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
