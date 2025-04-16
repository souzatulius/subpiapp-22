
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimeSelectorProps {
  hours: string;
  minutes: string;
  onTimeChange: (type: 'hours' | 'minutes', value: string) => void;
  onTimeFocus?: (type: 'hours' | 'minutes') => void;
  onTimeBlur?: (type: 'hours' | 'minutes') => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  hours,
  minutes,
  onTimeChange,
  onTimeFocus,
  onTimeBlur
}) => {
  // Define limited hour options (6-22)
  const hourOptions = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  // Define limited minute options (00 and 30)
  const minuteOptions = [0, 30];
  
  return (
    <div className="p-4 flex flex-col items-center justify-center">
      {/* Time display */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative">
          <Input
            type="text"
            value={hours}
            onChange={(e) => onTimeChange('hours', e.target.value)}
            onFocus={() => onTimeFocus?.('hours')}
            onBlur={() => onTimeBlur?.('hours')}
            className="w-14 text-center text-lg font-semibold"
            maxLength={2}
          />
        </div>
        <span className="text-xl font-semibold">:</span>
        <div className="relative">
          <Input
            type="text"
            value={minutes}
            onChange={(e) => onTimeChange('minutes', e.target.value)}
            onFocus={() => onTimeFocus?.('minutes')}
            onBlur={() => onTimeBlur?.('minutes')}
            className="w-14 text-center text-lg font-semibold"
            maxLength={2}
          />
        </div>
      </div>
      
      {/* Hours grid */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2 text-center">Horas</div>
        <div className="grid grid-cols-4 gap-2">
          {hourOptions.map((hour) => (
            <Button
              key={`hour-${hour}`}
              type="button"
              variant={hours === String(hour).padStart(2, '0') ? "default" : "outline"}
              className={cn(
                "h-10 w-12 p-0 rounded-xl",
                hours === String(hour).padStart(2, '0') && "bg-orange-500 text-white hover:bg-orange-600"
              )}
              onClick={() => onTimeChange('hours', String(hour).padStart(2, '0'))}
            >
              {String(hour).padStart(2, '0')}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Minutes grid */}
      <div>
        <div className="text-sm font-medium mb-2 text-center">Minutos</div>
        <div className="flex justify-center gap-2">
          {minuteOptions.map((minute) => (
            <Button
              key={`minute-${minute}`}
              type="button"
              variant={minutes === String(minute).padStart(2, '0') ? "default" : "outline"}
              className={cn(
                "h-10 w-12 p-0 rounded-xl",
                minutes === String(minute).padStart(2, '0') && "bg-orange-500 text-white hover:bg-orange-600"
              )}
              onClick={() => onTimeChange('minutes', String(minute).padStart(2, '0'))}
            >
              {String(minute).padStart(2, '0')}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
