
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface QuestionsSectionProps {
  perguntas: string[];
  handlePerguntaChange: (index: number, value: string) => void;
  errors?: ValidationError[];
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  perguntas,
  handlePerguntaChange,
  errors = []
}) => {
  return (
    <div className="space-y-6">
      <Label className="form-question-title">Perguntas principais sobre o caso</Label>
      
      <div className="space-y-4">
        {perguntas.slice(0, 5).map((pergunta, index) => (
          <div key={index}>
            <Label htmlFor={`pergunta-${index}`} className="text-sm font-medium text-gray-700 mb-1">
              Pergunta {index + 1}
            </Label>
            <Textarea
              id={`pergunta-${index}`}
              value={pergunta}
              onChange={(e) => handlePerguntaChange(index, e.target.value)}
              placeholder={`Digite a pergunta ${index + 1}`}
              className="h-12 py-3" // Match height with title input
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsSection;
