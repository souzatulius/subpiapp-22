
import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
}

export const AnimatedDateTimePicker: React.FC<AnimatedDateTimePickerProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = 'DD/MM/AAAA HH:MM',
  label,
  error = false,
  errorMessage,
  className,
  inputClassName,
}) => {
  // Parse ISO string to Date object if exists
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      return new Date(dateString);
    } catch (e) {
      return undefined;
    }
  };

  const [date, setDate] = useState<Date | undefined>(parseDate(value));
  const [hours, setHours] = useState<string>(date ? format(date, 'HH') : '12');
  const [minutes, setMinutes] = useState<string>(date ? format(date, 'mm') : '00');
  const [open, setOpen] = useState(false);

  // Get today's date at midnight for date comparison
  const today = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  // Update component state when value prop changes
  useEffect(() => {
    const newDate = parseDate(value);
    if (newDate) {
      setDate(newDate);
      setHours(format(newDate, 'HH'));
      setMinutes(format(newDate, 'mm'));
    }
  }, [value]);

  // Create a formatted string from date and time
  const createFormattedString = (): string => {
    if (!date) return '';
    try {
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate(undefined);
      return;
    }

    // Create a new date with the selected date and current time
    const updatedDate = new Date(newDate);
    updatedDate.setHours(parseInt(hours, 10) || 0);
    updatedDate.setMinutes(parseInt(minutes, 10) || 0);
    
    setDate(updatedDate);
    
    // Notify parent component
    onChange(updatedDate.toISOString());
  };

  // Handle time changes
  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    // Update local state
    if (type === 'hours') {
      setHours(value);
    } else {
      setMinutes(value);
    }

    // Only update if we have a date and valid input
    if (date && value !== '') {
      let h = type === 'hours' ? parseInt(value, 10) : parseInt(hours, 10);
      let m = type === 'minutes' ? parseInt(value, 10) : parseInt(minutes, 10);

      // Validate time values
      h = Math.max(0, Math.min(23, isNaN(h) ? 0 : h));
      m = Math.max(0, Math.min(59, isNaN(m) ? 0 : m));

      // Clone the date to avoid mutation
      const updatedDate = new Date(date);
      updatedDate.setHours(h, m);

      // Update date state and notify parent
      setDate(updatedDate);
      onChange(updatedDate.toISOString());
    }
  };

  // Focus handler for time inputs
  const handleFocus = (type: 'hours' | 'minutes') => {
    if (type === 'hours') {
      setHours('');
    } else {
      setMinutes('');
    }
  };

  // Blur handler for time inputs
  const handleTimeBlur = (type: 'hours' | 'minutes') => {
    if (type === 'hours') {
      // Format hours to be between 00-23
      const h = parseInt(hours, 10);
      if (isNaN(h)) {
        setHours('00');
      } else {
        setHours(String(Math.max(0, Math.min(23, h))).padStart(2, '0'));
      }
    } else {
      // Format minutes to be between 00-59
      const m = parseInt(minutes, 10);
      if (isNaN(m)) {
        setMinutes('00');
      } else {
        setMinutes(String(Math.max(0, Math.min(59, m))).padStart(2, '0'));
      }
    }

    // Update date with formatted time if we have a date
    if (date) {
      const h = parseInt(hours, 10) || 0;
      const m = parseInt(minutes, 10) || 0;
      
      const updatedDate = new Date(date);
      updatedDate.setHours(h, m);
      
      setDate(updatedDate);
      onChange(updatedDate.toISOString());
    }
  };

  // Handle direct input changes (when user types in the input field)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Don't attempt to parse if the field is empty
    if (!value.trim()) {
      setDate(undefined);
      onChange('');
      return;
    }
    
    try {
      // Try to parse the user input in DD/MM/YYYY HH:MM format
      const parts = value.split(' ');
      if (parts.length < 2) return; // Need both date and time parts
      
      const datePart = parts[0];
      const timePart = parts[1];
      
      const dateParts = datePart.split('/');
      if (dateParts.length !== 3) return;
      
      const timeParts = timePart.split(':');
      if (timeParts.length !== 2) return;
      
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JS Date
      const year = parseInt(dateParts[2], 10);
      const h = parseInt(timeParts[0], 10);
      const m = parseInt(timeParts[1], 10);
      
      if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(h) || isNaN(m)) return;
      
      const parsedDate = new Date(year, month, day, h, m);
      
      // Only update if we have a valid date
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        setHours(String(h).padStart(2, '0'));
        setMinutes(String(m).padStart(2, '0'));
        onChange(parsedDate.toISOString());
      }
    } catch (error) {
      console.error('Error parsing date input:', error);
    }
  };

  // Define limited hour options (6-22)
  const hourOptions = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  // Define limited minute options (00 and 30)
  const minuteOptions = [0, 30];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor="datetime-input"
          className={cn(error ? 'text-orange-500 font-semibold' : '')}
        >
          {label} {error && <span className="text-orange-500">*</span>}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="datetime-input"
              value={value ? createFormattedString() : ''}
              onChange={handleInputChange}
              onBlur={onBlur}
              placeholder={placeholder}
              className={cn(
                "h-12 rounded-xl pr-10", 
                error ? "border-orange-500" : "border-gray-300",
                inputClassName
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-500"
              onClick={() => setOpen(true)}
            >
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-auto p-0 bg-white rounded-lg shadow-lg animate-scale-in"
          align="start"
        >
          <div className="p-4 border-b">
            <div className="text-sm font-medium">Selecione a data e horário</div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Calendar section */}
            <div className="border-r">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(day) => day < today}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
            
            {/* Time picker section */}
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Horário</span>
              </div>
              
              {/* Time display */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    value={hours}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    onFocus={() => handleFocus('hours')}
                    onBlur={() => handleTimeBlur('hours')}
                    className="w-14 text-center text-lg font-semibold"
                    maxLength={2}
                  />
                </div>
                <span className="text-xl font-semibold">:</span>
                <div className="relative">
                  <Input
                    type="text"
                    value={minutes}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    onFocus={() => handleFocus('minutes')}
                    onBlur={() => handleTimeBlur('minutes')}
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
                      onClick={() => handleTimeChange('hours', String(hour).padStart(2, '0'))}
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
                      onClick={() => handleTimeChange('minutes', String(minute).padStart(2, '0'))}
                    >
                      {String(minute).padStart(2, '0')}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t flex justify-end">
            <Button 
              type="button" 
              onClick={() => setOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Confirmar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {error && errorMessage && (
        <p className="text-orange-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
