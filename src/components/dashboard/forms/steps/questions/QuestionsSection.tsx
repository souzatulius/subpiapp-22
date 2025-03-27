
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
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
  const handleAddQuestion = () => {
    onPerguntaChange(perguntas.length, '');
  };

  const handleRemoveQuestion = (index: number) => {
    const newPerguntas = [...perguntas];
    newPerguntas.splice(index, 1);
    // Manually update all indices after the removed one
    for (let i = index; i < newPerguntas.length; i++) {
      onPerguntaChange(i, newPerguntas[i]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Perguntas para a Área Técnica</Label>
        <Button 
          type="button" 
          onClick={handleAddQuestion}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Adicionar Pergunta
        </Button>
      </div>
      
      {perguntas.length === 0 ? (
        <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
          Nenhuma pergunta adicionada. Clique no botão acima para adicionar perguntas.
        </div>
      ) : (
        <div className="space-y-3">
          {perguntas.map((pergunta, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Textarea
                  value={pergunta}
                  onChange={(e) => onPerguntaChange(index, e.target.value)}
                  placeholder={`Pergunta ${index + 1}`}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuestion(index)}
                className="text-gray-500 hover:text-red-500 mt-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {hasFieldError('perguntas', errors) && (
        <p className="text-orange-500 text-sm mt-1">{getFieldErrorMessage('perguntas', errors)}</p>
      )}
    </div>
  );
};

export default QuestionsSection;
