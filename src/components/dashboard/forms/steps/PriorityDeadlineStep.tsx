
import React from 'react';
import { Label } from '@/components/ui/label';
import { ValidationError } from '@/lib/formValidationUtils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PriorityDeadlineStepProps {
  formData: {
    prioridade: string;
    prazo_resposta: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const timeOptions = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];

const PriorityDeadlineStep: React.FC<PriorityDeadlineStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Keep the time portion if it exists
    const currentDate = formData.prazo_resposta ? new Date(formData.prazo_resposta) : new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    date.setHours(currentDate.getHours(), currentDate.getMinutes());
    handleSelectChange('prazo_resposta', date.toISOString());
  };

  const handleTimeSelect = (timeString: string) => {
    if (!timeString) return;

    // Keep the date portion if it exists
    const dateToUse = formData.prazo_resposta ? new Date(formData.prazo_resposta) : new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    dateToUse.setHours(hours, minutes, 0, 0);
    handleSelectChange('prazo_resposta', dateToUse.toISOString());
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prioridade" className={`block mb-2 text-lg ${hasError('prioridade') ? 'text-orange-500 font-semibold' : ''}`}>
          Prioridade
        </Label>
        
        <div className="flex items-center mb-4">
          {/* Horizontal Traffic Light */}
          <div className="flex items-center p-2 rounded-lg bg-transparent">
            {/* Red Light */}
            <button 
              onClick={() => handleSelectChange('prioridade', 'alta')} 
              className={`w-14 h-14 rounded-full mr-4 transition-all hover:scale-110 ${formData.prioridade === 'alta' ? 'ring-4 ring-gray-400' : ''}`} 
              style={{ backgroundColor: '#FF4136' }} 
              aria-label="Prioridade Alta" 
            />
            {/* Yellow Light */}
            <button 
              onClick={() => handleSelectChange('prioridade', 'media')} 
              className={`w-14 h-14 rounded-full mr-4 transition-all hover:scale-110 ${formData.prioridade === 'media' ? 'ring-4 ring-gray-400' : ''}`} 
              style={{ backgroundColor: '#FFDC00' }} 
              aria-label="Prioridade Média" 
            />
            {/* Green Light */}
            <button 
              onClick={() => handleSelectChange('prioridade', 'baixa')} 
              className={`w-14 h-14 rounded-full transition-all hover:scale-110 ${formData.prioridade === 'baixa' ? 'ring-4 ring-gray-400' : ''}`} 
              style={{ backgroundColor: '#2ECC40' }} 
              aria-label="Prioridade Baixa" 
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="prazo_resposta" className="block mb-2 text-lg">
          Prazo para Resposta
        </Label>
        <div className="flex space-x-4">
          <div className="w-40">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal transition-all hover:bg-subpi-blue hover:text-white", !formData.prazo_resposta && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {formData.prazo_resposta ? format(new Date(formData.prazo_resposta), "dd/MM/yyyy", {
                  locale: ptBR
                }) : <span>Data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formData.prazo_resposta ? new Date(formData.prazo_resposta) : undefined} onSelect={handleDateSelect} initialFocus className="p-3 pointer-events-auto bg-gray-50" locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-24">
            <Select value={formData.prazo_resposta ? format(new Date(formData.prazo_resposta), "HH:mm") : undefined} onValueChange={handleTimeSelect}>
              <SelectTrigger className="transition-all hover:bg-subpi-blue hover:text-white hover:border-subpi-blue">
                <SelectValue placeholder="Horário" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(time => <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
