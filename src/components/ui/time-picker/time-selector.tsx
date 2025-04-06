
import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimeInput } from "./time-input";

interface TimeSelectorProps {
  selectedHours: string;
  selectedMinutes: string;
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
  onHoursFocus: () => void;
  onMinutesFocus: () => void;
  onHoursBlur: () => void;
  onMinutesBlur: () => void;
}

/**
 * TimeSelector component
 * 
 * A component that provides an interface for selecting time values (hours and minutes)
 * using specialized input fields with proper validation and formatting.
 * 
 * The component displays two TimeInput components separated by a colon,
 * allowing users to enter hours (00-23) and minutes (00-59) separately.
 * 
 * @param selectedHours - The current hours value
 * @param selectedMinutes - The current minutes value
 * @param onHoursChange - Callback when hours value changes
 * @param onMinutesChange - Callback when minutes value changes
 * @param onHoursFocus - Callback when hours input is focused
 * @param onMinutesFocus - Callback when minutes input is focused
 * @param onHoursBlur - Callback when hours input loses focus
 * @param onMinutesBlur - Callback when minutes input loses focus
 */
export function TimeSelector({
  selectedHours,
  selectedMinutes,
  onHoursChange,
  onMinutesChange,
  onHoursFocus,
  onMinutesFocus,
  onHoursBlur,
  onMinutesBlur,
}: TimeSelectorProps) {
  return (
    <div className="p-3 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <Label>Horário</Label>
        </div>
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </div>
  );
}
