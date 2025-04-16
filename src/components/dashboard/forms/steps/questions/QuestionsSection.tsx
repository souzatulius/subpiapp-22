
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationError } from '@/lib/formValidationUtils';
import { hasFieldError, getFieldErrorMessage } from '../identification/ValidationUtils';

interface QuestionsSectionProps {
  perguntas: string[];
  onPerguntaChange: (index: number, value: string) => void;
  errors?: ValidationError[];
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({ 
  perguntas, 
  onPerguntaChange,
  errors = [] 
}) => {
  // Calculate how many question fields to show
  // Show first field always, and then only show next field if previous has content
  const getVisibleFields = () => {
    let count = 1; // Always show at least the first field
    
    for (let i = 0; i < perguntas.length - 1; i++) {
      if (perguntas[i] && perguntas[i].trim() !== '') {
        count = i + 2; // Show one more field than the last filled one
      }
    }
    
    return Math.min(count, 5); // Maximum of 5 questions
  };
  
  const visibleFieldsCount = getVisibleFields();

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Perguntas para a Área Técnica</Label>
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: visibleFieldsCount }).map((_, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                value={perguntas[index] || ''}
                onChange={(e) => onPerguntaChange(index, e.target.value)}
                placeholder={`Pergunta ${index + 1}`}
                className="h-12"
              />
            </div>
          </div>
        ))}
      </div>
      
      {hasFieldError('perguntas', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('perguntas', errors)}</p>
      )}
    </div>
  );
};

export default QuestionsSection;
