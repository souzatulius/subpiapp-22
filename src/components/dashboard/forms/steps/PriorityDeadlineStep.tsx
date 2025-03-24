
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowDownAZIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';

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
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      handleSelectChange('prazo_resposta', date.toISOString());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="prioridade" 
          className={`block mb-2 ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prioridade {hasError('prioridade') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-3 gap-3">
          <Button 
            type="button" 
            variant={formData.prioridade === 'alta' ? "default" : "outline"} 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
              formData.prioridade === 'alta' ? "ring-2 ring-[#003570]" : ""
            } ${
              hasError('prioridade') ? 'border-orange-500' : ''
            }`} 
            onClick={() => handleSelectChange('prioridade', 'alta')}
          >
            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold">Alta</span>
          </Button>
          <Button 
            type="button" 
            variant={formData.prioridade === 'media' ? "default" : "outline"} 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
              formData.prioridade === 'media' ? "ring-2 ring-[#003570]" : ""
            } ${
              hasError('prioridade') ? 'border-orange-500' : ''
            }`} 
            onClick={() => handleSelectChange('prioridade', 'media')}
          >
            <ClockIcon className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold">Média</span>
          </Button>
          <Button 
            type="button" 
            variant={formData.prioridade === 'baixa' ? "default" : "outline"} 
            className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
              formData.prioridade === 'baixa' ? "ring-2 ring-[#003570]" : ""
            } ${
              hasError('prioridade') ? 'border-orange-500' : ''
            }`}
            onClick={() => handleSelectChange('prioridade', 'baixa')}
          >
            <ArrowDownAZIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-semibold">Baixa</span>
          </Button>
        </div>
        {hasError('prioridade') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prioridade')}</p>
        )}
      </div>

      <div>
        <Label 
          htmlFor="prazo_resposta" 
          className={`block mb-2 ${hasError('prazo_resposta') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Prazo para Resposta {hasError('prazo_resposta') && <span className="text-orange-500">*</span>}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                hasError('prazo_resposta') ? 'border-orange-500' : ''
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={ptBR}
              initialFocus
              disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
        {hasError('prazo_resposta') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('prazo_resposta')}</p>
        )}
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
