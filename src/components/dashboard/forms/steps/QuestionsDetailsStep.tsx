
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '../components/FileUpload';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    detalhes_solicitacao: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
}

const QuestionsDetailsStep: React.FC<QuestionsDetailsStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Perguntas (até 5)</Label>
        {formData.perguntas.map((pergunta, index) => (
          <Input 
            key={index} 
            className="mt-2 rounded-lg" 
            value={pergunta} 
            onChange={e => handlePerguntaChange(index, e.target.value)} 
          />
        ))}
      </div>
      
      <div>
        <Label htmlFor="detalhes_solicitacao">Detalhes da Solicitação</Label>
        <Textarea 
          id="detalhes_solicitacao" 
          name="detalhes_solicitacao" 
          value={formData.detalhes_solicitacao} 
          onChange={handleChange} 
          maxLength={500} 
          rows={4} 
          className="rounded-lg" 
        />
      </div>
      
      <FileUpload />
    </div>
  );
};

export default QuestionsDetailsStep;
