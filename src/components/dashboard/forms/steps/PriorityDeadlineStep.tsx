
import React from 'react';
import { BellRing, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { formatDateInput } from '@/lib/inputFormatting';

interface PriorityDeadlineStepProps {
  formData: {
    prioridade: string;
    prazo_resposta: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: ValidationError[];
}

const PriorityDeadlineStep: React.FC<PriorityDeadlineStepProps> = ({
  formData,
  handleSelectChange,
  handleChange,
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

  // Convert ISO date string to DD/MM/YYYY HH:MM format for display
  const formatDateTimeForDisplay = (isoString: string): string => {
    if (!isoString) return '';
    
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      console.error('Error formatting date for display:', e);
      return '';
    }
  };

  // Handle manual date input and convert to ISO
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Save the raw input in the text field
    handleChange(e);
    
    // Try to parse the input to an ISO date string
    try {
      // Extract date and time components
      const dateTimeParts = value.split(' ');
      if (dateTimeParts.length !== 2) return;
      
      const dateParts = dateTimeParts[0].split('/');
      const timeParts = dateTimeParts[1].split(':');
      
      if (dateParts.length !== 3 || timeParts.length !== 2) return;
      
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JS Date
      const year = parseInt(dateParts[2], 10);
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      if (isNaN(day) || isNaN(month) || isNaN(year) || 
          isNaN(hours) || isNaN(minutes)) return;
      
      // Create ISO string from the parsed components
      const date = new Date(year, month, day, hours, minutes);
      if (isNaN(date.getTime())) return;
      
      const isoString = date.toISOString();
      handleSelectChange('prazo_resposta', isoString);
      
      console.log('Successfully parsed date input to ISO:', isoString);
    } catch (e) {
      console.error('Error parsing date input:', e);
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
          <input
            type="text"
            id="prazo_resposta"
            name="prazo_resposta"
            placeholder="DD/MM/AAAA HH:MM"
            value={formData.prazo_resposta ? formatDateTimeForDisplay(formData.prazo_resposta) : ''}
            onChange={handleDateChange}
            className={`w-full h-12 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${hasError('prazo_resposta') ? 'border-orange-500' : ''}`}
          />
        </div>
        <p className="text-gray-500 text-sm mt-1">Digite a data no formato DD/MM/AAAA HH:MM (Ex: 31/12/2023 14:30)</p>
        {hasError('prazo_resposta') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
        )}
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
