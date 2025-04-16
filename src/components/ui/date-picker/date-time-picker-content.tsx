
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { PopoverContent } from "@/components/ui/popover";
import { TimeInput } from "../time-picker/time-input";
import { TimeDropdown } from "../time-picker/time-dropdown";
import { Clock } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { TimeInputProps, TimeDropdownProps } from "./date-picker-types";

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
  today: Date;
  useDropdownTimeSelect?: boolean;
}

/**
 * DateTimePickerContent component
 * 
 * Renders the content of the date picker popover, including a calendar for date selection
 * and time input fields when time selection is enabled.
 */
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
  today,
  useDropdownTimeSelect = false
}: DateTimePickerContentProps) {
  // Generate hours options (6:00 - 22:00)
  const hoursOptions = React.useMemo(() => 
    Array.from({ length: 17 }, (_, i) => {
      const hour = i + 6; // Start from 6
      return hour.toString().padStart(2, '0');
    }),
  []);

  // Generate minutes options (00 and 30)
  const minutesOptions = React.useMemo(() => ['00', '30'], []);
  
  // Log the current state for debugging
  React.useEffect(() => {
    if (date) {
      console.log("DateTimePickerContent: Current date:", date.toISOString());
      console.log("DateTimePickerContent: Selected hours/minutes:", selectedHours, selectedMinutes);
    }
  }, [date, selectedHours, selectedMinutes]);

  return (
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onSelect}
        initialFocus
        disabled={(day) => day < today}
        locale={ptBR}
      />
      {showTimeSelect && (
        <div className="p-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Label>Horário</Label>
            </div>
            <div className="flex items-center space-x-2">
              {useDropdownTimeSelect ? (
                <>
                  <TimeDropdown
                    value={selectedHours}
                    onChange={onHoursChange}
                    options={hoursOptions}
                    label="Horas"
                  />
                  <span>:</span>
                  <TimeDropdown
                    value={selectedMinutes}
                    onChange={onMinutesChange}
                    options={minutesOptions}
                    label="Minutos"
                  />
                </>
              ) : (
                <>
                  <TimeInput
                    value={selectedHours}
                    onChange={onHoursChange}
                    onFocus={onHoursFocus}
                    onBlur={onHoursBlur}
                  />
                  <span>:</span>
                  <TimeInput
                    value={selectedMinutes}
                    onChange={onMinutesChange}
                    onFocus={onMinutesFocus}
                    onBlur={onMinutesBlur}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </PopoverContent>
  );
}
