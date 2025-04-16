
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { ValidationError } from '@/lib/formValidationUtils';
import { BellRing, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPriorityStyles } from '@/utils/priorityUtils';

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
  // Updated priorities to match the new naming convention (Alta → Urgente)
  const priorities = [
    { id: 'alta', label: 'Urgente', icon: <Flame className="h-5 w-5 text-red-500" /> },
    { id: 'media', label: 'Normal', icon: <BellRing className="h-5 w-5 text-blue-500" /> },
    { id: 'baixa', label: 'Baixa', icon: <BellRing className="h-5 w-5 text-green-500" /> }
  ];

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Helper function to safely parse an ISO date string to a Date
  const parseISODate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      // Check if it's a valid date
      if (isNaN(date.getTime())) return undefined;
      return date;
    } catch (e) {
      console.error("Error parsing date:", e);
      return undefined;
    }
  };

  // Handle date selection with proper timezone handling
  const handleDateSelection = (date?: Date) => {
    if (date) {
      // Create a consistent ISO string representation
      const isoString = date.toISOString();
      console.log("Selected date ISO string:", isoString);
      handleSelectChange('prazo_resposta', isoString);
    } else {
      handleSelectChange('prazo_resposta', '');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="prioridade" 
          className={`block mb-2 text-base font-medium ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prioridade da solicitação {hasError('prioridade') && <span className="text-orange-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {priorities.map(priority => (
            <Button 
              key={priority.id + priority.label} 
              type="button" 
              variant="outline" 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 border-gray-300
                ${formData.prioridade === priority.id ? 
                  "bg-orange-500 text-white border-transparent hover:bg-orange-600" : 
                  "hover:bg-gray-100 hover:text-gray-800"}
                ${hasError('prioridade') ? 'border-orange-500' : ''}
                transition-all duration-300`}
              onClick={() => handleSelectChange('prioridade', priority.id)}
            >
              <div className={`
                ${formData.prioridade === priority.id ? 'text-white' : ''}
                transition-colors
              `}>
                {formData.prioridade === priority.id ? (
                  <div className="text-white">
                    {priority.icon}
                  </div>
                ) : (
                  <div>
                    {priority.icon}
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold">
                {priority.label}
              </span>
            </Button>
          ))}
        </div>
        {hasError('prioridade') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prioridade')}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="prazo_resposta" 
          className={`block mb-2 ${hasError('prazo_resposta') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prazo para resposta {hasError('prazo_resposta') && <span className="text-orange-500">*</span>}
        </label>
        <div className="w-full">
          <DatePicker
            date={parseISODate(formData.prazo_resposta)}
            onSelect={handleDateSelection}
            showTimeSelect={true}
            useDropdownTimeSelect={true}
            placeholder="Selecione a data e horário"
            className={hasError('prazo_resposta') ? 'border-orange-500' : ''}
          />
        </div>
        {hasError('prazo_resposta') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
        )}
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
