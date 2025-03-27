import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '@/components/dashboard/forms/steps/identification/ValidationUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PriorityDeadlineStepProps {
  formData: {
    prioridade: string;
    prazo_resposta: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  errors: ValidationError[];
}

const PriorityDeadlineStep: React.FC<PriorityDeadlineStepProps> = ({
  formData,
  handleSelectChange,
  errors
}) => {
  // Format the date for the input value (YYYY-MM-DD format)
  let dateValue = '';
  let timeHours = '';
  let timeMinutes = '';
  
  if (formData.prazo_resposta) {
    try {
      const date = new Date(formData.prazo_resposta);
      if (!isNaN(date.getTime())) {
        dateValue = date.toISOString().split('T')[0];
        timeHours = date.getHours().toString().padStart(2, '0');
        timeMinutes = date.getMinutes().toString().padStart(2, '0');
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
  }

  // Set default date and time to current date and next half hour
  useEffect(() => {
    if (!formData.prazo_resposta) {
      const now = new Date();
      const currentMinutes = now.getMinutes();
      // Set to next half hour (30 minutes from now, rounded to nearest 30)
      const nextMinutes = currentMinutes < 30 ? 30 : 0;
      const nextHours = currentMinutes < 30 ? now.getHours() : now.getHours() + 1;
      
      now.setHours(nextHours, nextMinutes, 0, 0);
      handleSelectChange('prazo_resposta', now.toISOString());
    }
  }, []);

  // Toggle priority selection - allows deselection
  const togglePriority = (priority: string) => {
    if (formData.prioridade === priority) {
      // If already selected, deselect it
      handleSelectChange('prioridade', '');
    } else {
      // Otherwise select it
      handleSelectChange('prioridade', priority);
    }
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (!newDate) {
      handleSelectChange('prazo_resposta', '');
      return;
    }
    
    try {
      // Combine the new date with the existing time or default to midnight
      const date = new Date(newDate);
      const hours = timeHours ? parseInt(timeHours) : 0;
      const minutes = timeMinutes ? parseInt(timeMinutes) : 0;
      
      date.setHours(hours, minutes, 0, 0);
      handleSelectChange('prazo_resposta', date.toISOString());
    } catch (error) {
      console.error('Error setting date:', error);
    }
  };

  // Handle time change
  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (!dateValue) return;
    
    try {
      const date = new Date(dateValue);
      const hours = type === 'hours' ? parseInt(value) : (timeHours ? parseInt(timeHours) : 0);
      const minutes = type === 'minutes' ? parseInt(value) : (timeMinutes ? parseInt(timeMinutes) : 0);
      
      date.setHours(hours, minutes, 0, 0);
      handleSelectChange('prazo_resposta', date.toISOString());
      
      if (type === 'hours') timeHours = value;
      if (type === 'minutes') timeMinutes = value;
    } catch (error) {
      console.error('Error setting time:', error);
    }
  };

  // Generate hour and minute options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`text-lg font-medium block mb-2 ${hasFieldError('prioridade', errors) ? 'text-orange-500 font-semibold' : 'text-blue-950'}`}
        >
          Prioridade {hasFieldError('prioridade', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant={formData.prioridade === 'baixa' ? "default" : "outline"} 
            className={`selection-button rounded-xl ${
              formData.prioridade === 'baixa' ? "bg-green-500 text-white hover:bg-green-600" : "hover:bg-green-500 hover:text-white"
            }`}
            onClick={() => togglePriority('baixa')}
          >
            Baixa
          </Button>
          <Button 
            type="button" 
            variant={formData.prioridade === 'media' ? "default" : "outline"} 
            className={`selection-button rounded-xl ${
              formData.prioridade === 'media' ? "bg-yellow-500 text-white hover:bg-yellow-600" : "hover:bg-yellow-500 hover:text-white"
            }`}
            onClick={() => togglePriority('media')}
          >
            Média
          </Button>
          <Button 
            type="button" 
            variant={formData.prioridade === 'alta' ? "default" : "outline"} 
            className={`selection-button rounded-xl ${
              formData.prioridade === 'alta' ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-red-500 hover:text-white"
            }`}
            onClick={() => togglePriority('alta')}
          >
            Alta
          </Button>
        </div>
        {hasFieldError('prioridade', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prioridade', errors)}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={`text-lg font-medium block mb-2 ${hasFieldError('prazo_resposta', errors) ? 'text-orange-500 font-semibold' : 'text-blue-950'}`}
        >
          Prazo para resposta {hasFieldError('prazo_resposta', errors) && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            id="prazo_resposta_date"
            name="prazo_resposta_date"
            value={dateValue}
            onChange={handleDateChange}
            className={`rounded-xl p-2 border border-gray-300 ${hasFieldError('prazo_resposta', errors) ? 'border-orange-500' : ''}`}
          />
          
          <Select value={timeHours} onValueChange={(value) => handleTimeChange('hours', value)}>
            <SelectTrigger className="w-[80px] rounded-xl">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {hourOptions.map(hour => (
                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span>:</span>
          
          <Select value={timeMinutes} onValueChange={(value) => handleTimeChange('minutes', value)}>
            <SelectTrigger className="w-[80px] rounded-xl">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map(minute => (
                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasFieldError('prazo_resposta', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prazo_resposta', errors)}</p>
        )}
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
