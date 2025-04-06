import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent } from "@/components/ui/popover";
import { TimeSelector } from "../time-picker/time-selector";
import { ptBR } from "date-fns/locale";

interface DateTimePickerContentProps {
  date?: Date;
  onSelect: (date?: Date) => void;
  showTimeSelect?: boolean;
  selectedHours: string;
  selectedMinutes: string;
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
  onHoursFocus: () => void;
  onMinutesFocus: () => void;
  onHoursBlur: () => void;
  onMinutesBlur: () => void;
  className?: string;
  today: Date;
}

export function DateTimePickerContent({
  date,
  onSelect,
  showTimeSelect = false,
  selectedHours,
  selectedMinutes,
  onHoursChange,
  onMinutesChange,
  onHoursFocus,
  onMinutesFocus,
  onHoursBlur,
  onMinutesBlur,
  className,
  today
}: DateTimePickerContentProps) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onSelect(undefined);
      return;
    }

    if (showTimeSelect) {
      // Keep the user-selected time when changing the date
      selectedDate.setHours(
        parseInt(selectedHours || '0', 10), 
        parseInt(selectedMinutes || '0', 10)
      );
    }
    
    onSelect(selectedDate);
  };

  return (
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        disabled={(date) => date < today}
        locale={ptBR}
        className={cn("p-3 pointer-events-auto", className)}
      />

      {showTimeSelect && (
        <TimeSelector
          selectedHours={selectedHours}
          selectedMinutes={selectedMinutes}
          onHoursChange={onHoursChange}
          onMinutesChange={onMinutesChange}
          onHoursFocus={onHoursFocus}
          onMinutesFocus={onMinutesFocus}
          onHoursBlur={onHoursBlur}
          onMinutesBlur={onMinutesBlur}
        />
      )}
    </PopoverContent>
  );
}
