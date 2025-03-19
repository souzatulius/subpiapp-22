
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PriorityDeadlineStepProps {
  formData: {
    prioridade: string;
    prazo_resposta: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const PriorityDeadlineStep: React.FC<PriorityDeadlineStepProps> = ({
  formData,
  handleChange,
  handleSelectChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prioridade" className="block mb-2">Prioridade</Label>
        <RadioGroup 
          value={formData.prioridade} 
          onValueChange={value => handleSelectChange('prioridade', value)} 
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alta" id="alta" />
            <Label htmlFor="alta" className="text-red-600 font-medium">Alta</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="média" id="media" />
            <Label htmlFor="media" className="text-yellow-600 font-medium">Média</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="baixa" id="baixa" />
            <Label htmlFor="baixa" className="text-green-600 font-medium">Baixa</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="prazo_resposta">Prazo para Resposta</Label>
        <Input 
          id="prazo_resposta" 
          name="prazo_resposta" 
          type="datetime-local" 
          value={formData.prazo_resposta} 
          onChange={handleChange} 
          className="rounded-lg" 
        />
      </div>
    </div>
  );
};

export default PriorityDeadlineStep;
