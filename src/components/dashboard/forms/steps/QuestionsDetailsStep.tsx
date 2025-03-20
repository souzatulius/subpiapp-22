
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { ValidationError } from '@/lib/formValidationUtils';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    detalhes_solicitacao: string;
    arquivo_url: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePerguntaChange: (index: number, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors?: ValidationError[];
}

const QuestionsDetailsStep: React.FC<QuestionsDetailsStepProps> = ({
  formData,
  handleChange,
  handlePerguntaChange,
  handleSelectChange,
  errors = []
}) => {
  const [activeQuestions, setActiveQuestions] = useState<number>(0);

  useEffect(() => {
    // Determine how many question fields should be visible
    let count = 0;
    for (let i = 0; i < formData.perguntas.length; i++) {
      if (formData.perguntas[i]?.trim()) {
        count = i + 1;
      }
    }
    // Show one more empty field if all are filled
    if (count === formData.perguntas.length || count === 0) {
      setActiveQuestions(Math.min(count + 1, 5));
    } else {
      setActiveQuestions(count + 1);
    }
  }, [formData.perguntas]);

  const handleQuestionChange = (index: number, value: string) => {
    handlePerguntaChange(index, value);
  };

  const handleFileChange = (fileUrl: string) => {
    handleSelectChange('arquivo_url', fileUrl);
  };

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Perguntas</Label>
        
        {Array.from({ length: activeQuestions }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input 
              className="flex-1 rounded-lg"
              value={formData.perguntas[index] || ''}
              onChange={e => handleQuestionChange(index, e.target.value)}
              placeholder={`Pergunta ${index + 1}`}
            />
            {index === activeQuestions - 1 && activeQuestions < 5 && formData.perguntas[index]?.trim() && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setActiveQuestions(prev => Math.min(prev + 1, 5))}
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <Label 
          htmlFor="detalhes_solicitacao" 
          className={`block ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Detalhes da Solicitação
        </Label>
        <Textarea 
          id="detalhes_solicitacao" 
          name="detalhes_solicitacao" 
          value={formData.detalhes_solicitacao} 
          onChange={handleChange} 
          maxLength={500} 
          rows={4} 
          className={`rounded-lg ${hasError('detalhes_solicitacao') ? 'border-orange-500 ring-orange-500' : ''}`} 
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>
      
      <FileUpload 
        onChange={handleFileChange}
        value={formData.arquivo_url}
      />
    </div>
  );
};

export default QuestionsDetailsStep;
