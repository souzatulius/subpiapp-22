
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { hasFieldError, getFieldErrorMessage } from './identification/ValidationUtils';

interface PriorityDeadlineStepProps {
  formData: {
    prioridade: string;
    prazo_resposta: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const PriorityDeadlineStep: React.FC<PriorityDeadlineStepProps> = ({
  formData,
  handleSelectChange,
  errors = []
}) => {
  const [date, setDate] = useState<Date | undefined>(
    formData.prazo_resposta ? new Date(formData.prazo_resposta) : undefined
  );
  
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  
  useEffect(() => {
    // Initialize time from existing date if available
    if (date) {
      setSelectedHour(date.getHours().toString().padStart(2, '0'));
      setSelectedMinute(date.getMinutes() >= 30 ? "30" : "00");
    }
  }, []);
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  
  // Generate available hours (6-22)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Handle date and time selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      
      // Set the time part
      newDate.setHours(parseInt(selectedHour));
      newDate.setMinutes(parseInt(selectedMinute));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      
      setDate(newDate);
      handleSelectChange('prazo_resposta', newDate.toISOString());
    } else {
      setDate(undefined);
      handleSelectChange('prazo_resposta', '');
    }
  };

  // Handle time change
  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (type === 'hour') {
      setSelectedHour(value);
    } else {
      setSelectedMinute(value);
    }
    
    if (date) {
      const newDate = new Date(date);
      
      if (type === 'hour') {
        newDate.setHours(parseInt(value));
      } else {
        newDate.setMinutes(parseInt(value));
      }
      
      setDate(newDate);
      handleSelectChange('prazo_resposta', newDate.toISOString());
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority selection */}
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`block mb-2 ${hasFieldError('prioridade', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prioridade {hasFieldError('prioridade', errors) && <span className="text-orange-500">*</span>}
        </Label>
        
        <ToggleGroup 
          type="single" 
          variant="outline"
          value={formData.prioridade} 
          onValueChange={(value) => value && handleSelectChange('prioridade', value)}
          className="justify-start"
        >
          <ToggleGroupItem 
            value="baixa" 
            className={`rounded-xl ${formData.prioridade === 'baixa' ? 'bg-green-100 border-green-500 text-green-700' : ''}`}
          >
            Baixa
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="media" 
            className={`rounded-xl ${formData.prioridade === 'media' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : ''}`}
          >
            Média
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="alta" 
            className={`rounded-xl ${formData.prioridade === 'alta' ? 'bg-red-100 border-red-500 text-red-700' : ''}`}
          >
            Alta
          </ToggleGroupItem>
        </ToggleGroup>
        
        {hasFieldError('prioridade', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prioridade', errors)}</p>
        )}
      </div>

      {/* Deadline selection */}
      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={`block mb-2 ${hasFieldError('prazo_resposta', errors) ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prazo para Resposta {hasFieldError('prazo_resposta', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex space-x-2 max-w-xl">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-56 justify-start text-left font-normal ${
                  hasFieldError('prazo_resposta', errors) ? 'border-orange-500' : ''
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={ptBR}
                initialFocus
                className="pointer-events-auto"
                disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-2">
            <Select 
              value={selectedHour} 
              onValueChange={(value) => handleTimeChange('hour', value)}
              disabled={!date}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour.toString().padStart(2, '0')}h
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span>:</span>
            
            <Select 
              value={selectedMinute} 
              onValueChange={(value) => handleTimeChange('minute', value)}
              disabled={!date}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00min</SelectItem>
                <SelectItem value="30">30min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFieldError('prazo_resposta', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prazo_resposta', errors)}</p>
        )}
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
