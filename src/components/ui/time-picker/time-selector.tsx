
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
