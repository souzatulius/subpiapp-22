
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { ValidationError } from '@/lib/formValidationUtils';
import { BellRing, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  // Updated priorities to match the database constraints
  // Using 'alta', 'media', 'baixa' values instead of numeric values
  const priorities = [
    { id: 'alta', label: 'Urgente', icon: <Flame className="h-5 w-5 text-red-500" /> },
    { id: 'alta', label: 'Alta', icon: <BellRing className="h-5 w-5 text-orange-500" /> },
    { id: 'media', label: 'Normal', icon: <BellRing className="h-5 w-5 text-blue-500" /> },
    { id: 'baixa', label: 'Baixa', icon: <BellRing className="h-5 w-5 text-green-500" /> }
  ];

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="prioridade" 
          className={`block mb-2 ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prioridade da solicitação {hasError('prioridade') && <span className="text-orange-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {priorities.map(priority => (
            <Button 
              key={priority.id + priority.label} 
              type="button" 
              variant={formData.prioridade === priority.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                formData.prioridade === priority.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('prioridade') ? 'border-orange-500' : ''
              } hover:bg-[#002855] hover:text-white`} 
              onClick={() => handleSelectChange('prioridade', priority.id)}
            >
              {priority.icon}
              <span className="text-sm font-semibold">{priority.label}</span>
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
            date={formData.prazo_resposta ? new Date(formData.prazo_resposta) : undefined}
            onSelect={(date) => handleSelectChange('prazo_resposta', date ? date.toISOString() : '')}
            showTimeSelect={true}
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
