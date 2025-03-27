
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
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
  
  const handleRemoveQuestion = (index: number) => {
    // Shift all questions up by one after removing
    const newPerguntas = [...perguntas];
    newPerguntas.splice(index, 1);
    newPerguntas.push(''); // Add empty string at the end
    
    // Update all values
    for (let i = index; i < newPerguntas.length; i++) {
      onPerguntaChange(i, newPerguntas[i]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Perguntas para a Área Técnica</Label>
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: visibleFieldsCount }).map((_, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Textarea
                value={perguntas[index] || ''}
                onChange={(e) => onPerguntaChange(index, e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            {perguntas[index] && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuestion(index)}
                className="text-gray-500 hover:text-red-500 mt-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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
