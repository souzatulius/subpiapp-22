
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import FileUpload from '../components/FileUpload';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    detalhes_solicitacao: string;
    arquivo_url: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const QuestionsDetailsStep: React.FC<QuestionsDetailsStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange,
  handleSelectChange
}) => {
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>(
    formData.perguntas.filter(p => p.trim() !== '').length > 0 
      ? [0] 
      : []
  );

  const handleAddQuestion = () => {
    const currentIndex = visibleQuestions.length;
    if (currentIndex < 5) {
      setVisibleQuestions([...visibleQuestions, currentIndex]);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    handlePerguntaChange(index, '');
    setVisibleQuestions(visibleQuestions.filter(i => i !== index));
  };

  const handleFileChange = (fileUrl: string) => {
    handleSelectChange('arquivo_url', fileUrl);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Perguntas</Label>
          {visibleQuestions.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar pergunta
            </Button>
          )}
        </div>
        
        {visibleQuestions.length === 0 && (
          <div className="text-sm text-gray-500 italic mb-2">
            Clique no botão acima para adicionar perguntas.
          </div>
        )}
        
        {visibleQuestions.map((questionIndex) => (
          <div key={questionIndex} className="flex items-center gap-2 mb-2">
            <Input 
              className="flex-1 rounded-lg" 
              value={formData.perguntas[questionIndex] || ''} 
              onChange={e => handlePerguntaChange(questionIndex, e.target.value)}
              placeholder="Digite a pergunta aqui" 
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveQuestion(questionIndex)}
              className="flex-shrink-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
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
      
      <FileUpload 
        onChange={handleFileChange}
        value={formData.arquivo_url}
      />
    </div>
  );
};

export default QuestionsDetailsStep;
