
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '@/components/dashboard/forms/steps/identification/ValidationUtils';
import { DatePicker } from '@/components/ui/date-picker';
import { isValid } from 'date-fns';

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
  // Parse date string to Date object for the DatePicker
  let prazoDate: Date | undefined = undefined;
  
  try {
    prazoDate = formData.prazo_resposta ? new Date(formData.prazo_resposta) : undefined;
    
    // Check if the parsed date is valid
    if (prazoDate && !isValid(prazoDate)) {
      prazoDate = undefined;
    }
  } catch (error) {
    console.error("Date parsing error:", error);
    prazoDate = undefined;
  }
  
  // Handle date selection from the DatePicker
  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      handleSelectChange('prazo_resposta', '');
      return;
    }
    
    if (isValid(date)) {
      // Set time to current time if it's 00:00
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      // If time is midnight (00:00), set to current time
      if (hours === 0 && minutes === 0) {
        const now = new Date();
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
      }
      
      // Use the Date object with updated time information
      handleSelectChange('prazo_resposta', date.toISOString());
    }
  };

  // Add ability to deselect priority
  const handlePriorityClick = (priority: string) => {
    if (formData.prioridade === priority) {
      handleSelectChange('prioridade', ''); // Deselect if clicking the same priority
    } else {
      handleSelectChange('prioridade', priority);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`form-question-title ${hasFieldError('prioridade', errors) ? 'text-orange-500 font-semibold' : ''}`}
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
            onClick={() => handlePriorityClick('baixa')}
          >
            Baixa
          </Button>
          <Button 
            type="button" 
            variant={formData.prioridade === 'media' ? "default" : "outline"} 
            className={`selection-button rounded-xl ${
              formData.prioridade === 'media' ? "bg-yellow-500 text-white hover:bg-yellow-600" : "hover:bg-yellow-500 hover:text-white"
            }`}
            onClick={() => handlePriorityClick('media')}
          >
            Média
          </Button>
          <Button 
            type="button" 
            variant={formData.prioridade === 'alta' ? "default" : "outline"} 
            className={`selection-button rounded-xl ${
              formData.prioridade === 'alta' ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-red-500 hover:text-white"
            }`}
            onClick={() => handlePriorityClick('alta')}
          >
            Alta
          </Button>
        </div>
        {hasFieldError('prioridade', errors) && (
          <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prioridade', errors)}</p>
        )}
      </div>

      {formData.prioridade && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="prazo_resposta" 
            className={`form-question-title ${hasFieldError('prazo_resposta', errors) ? 'text-orange-500 font-semibold' : ''}`}
          >
            Prazo para resposta {hasFieldError('prazo_resposta', errors) && <span className="text-orange-500">*</span>}
          </Label>
          <div className="mt-1">
            <DatePicker
              date={prazoDate}
              setDate={handleDateChange}
              placeholder="Selecione uma data"
              className={hasFieldError('prazo_resposta', errors) ? 'border-orange-500' : ''}
              showTimeSelect={true}
            />
          </div>
          {hasFieldError('prazo_resposta', errors) && (
            <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('prazo_resposta', errors)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriorityDeadlineStep;
