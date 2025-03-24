
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    titulo: string;
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
  const [activeQuestions, setActiveQuestions] = useState<number[]>([0]);
  
  // Monitor active questions and automatically add a new empty question field
  // when the user starts typing in the last active question
  useEffect(() => {
    const lastActiveIndex = Math.max(...activeQuestions);
    if (
      formData.perguntas[lastActiveIndex]?.trim() !== '' &&
      activeQuestions.length < 5
    ) {
      setActiveQuestions([...activeQuestions, lastActiveIndex + 1]);
    }
  }, [formData.perguntas, activeQuestions]);

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const removeQuestion = (index: number) => {
    // Don't allow removing if only one question
    if (activeQuestions.length <= 1) return;
    
    // Update active questions
    const newActiveQuestions = activeQuestions.filter(i => i !== index);
    setActiveQuestions(newActiveQuestions);
    
    // Update form data
    const newPerguntas = [...formData.perguntas];
    newPerguntas.splice(index, 1);
    newPerguntas.push(''); // Keep array length consistent
    handleSelectChange('perguntas', JSON.stringify(newPerguntas));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="titulo" className={`block mb-2 ${hasError('titulo') ? 'text-orange-500 font-semibold' : ''}`}>
          Título da Demanda {hasError('titulo') && <span className="text-orange-500">*</span>}
        </Label>
        <Input 
          id="titulo" 
          name="titulo" 
          value={formData.titulo} 
          onChange={handleChange} 
          className={hasError('titulo') ? 'border-orange-500' : ''}
        />
        {hasError('titulo') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('titulo')}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className={`block ${hasError('perguntas') ? 'text-orange-500 font-semibold' : ''}`}>
            Perguntas para a Área Técnica {hasError('perguntas') && <span className="text-orange-500">*</span>}
          </Label>
        </div>
        
        <div className="space-y-3">
          {activeQuestions.map(index => (
            <div key={index} className="flex gap-2">
              <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 transition-all hover:shadow-md">
                <input
                  value={formData.perguntas[index] || ''}
                  onChange={(e) => handlePerguntaChange(index, e.target.value)}
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
    </div>
  );
};

export default QuestionsDetailsStep;
