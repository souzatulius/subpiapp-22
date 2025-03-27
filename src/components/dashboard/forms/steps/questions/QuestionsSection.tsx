
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';

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
  const [activeQuestions, setActiveQuestions] = useState<number[]>(
    perguntas.filter(p => p.trim() !== '').length > 0 
      ? perguntas.filter(p => p.trim() !== '').map((_, i) => i) 
      : [0]
  );
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Observe typing to automatically add a new question
  useEffect(() => {
    const nonEmptyQuestions = perguntas.filter(p => p.trim() !== '');
    
    // If the last question isn't empty and we can add more questions
    if (nonEmptyQuestions.length > 0 && 
        nonEmptyQuestions.length === activeQuestions.length && 
        activeQuestions.length < 5) {
      addQuestion();
    }
  }, [perguntas]);

  const addQuestion = () => {
    if (activeQuestions.length < 5) {
      const nextIndex = activeQuestions.length;
      setActiveQuestions([...activeQuestions, nextIndex]);
    }
  };

  const removeQuestion = (index: number) => {
    // Update active questions
    const newActiveQuestions = activeQuestions.filter(i => i !== index).map((val, idx) => idx);
    setActiveQuestions(newActiveQuestions);
    
    // Update formData
    const newPerguntas = [...perguntas];
    newPerguntas.splice(index, 1);
    newPerguntas.push(''); // Keep array with 5 positions
    
    // Update using the existing method
    for (let i = 0; i < newPerguntas.length; i++) {
      if (i < newActiveQuestions.length) {
        onPerguntaChange(i, newPerguntas[i]);
      } else {
        onPerguntaChange(i, '');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label className={`block ${hasError('perguntas') ? 'text-orange-500 font-semibold' : ''}`}>
          Perguntas para a Área Técnica
        </Label>
      </div>
      
      <div className="space-y-3">
        {activeQuestions.map(index => (
          <div key={index} className="flex gap-2">
            <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 transition-all hover:shadow-md">
              <input
                value={perguntas[index] || ''}
                onChange={(e) => onPerguntaChange(index, e.target.value)}
                className="border-0 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 w-full py-3 bg-transparent"
                placeholder={`Pergunta ${index + 1}`}
              />
            </div>
            {activeQuestions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {hasError('perguntas') && (
        <p className="text-orange-500 text-sm mt-1">{getErrorMessage('perguntas')}</p>
      )}
    </div>
  );
};

export default QuestionsSection;
