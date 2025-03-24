
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ValidationError } from '@/lib/formValidationUtils';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionsDetailsStepProps {
  formData: {
    perguntas: string[];
    detalhes_solicitacao: string;
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
  const [activeQuestions, setActiveQuestions] = useState<number[]>(
    formData.perguntas.filter(p => p.trim() !== '').length > 0 
      ? formData.perguntas.filter(p => p.trim() !== '').map((_, i) => i) 
      : [0]
  );
  
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

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
    
    // Update form data
    const newPerguntas = [...formData.perguntas];
    newPerguntas.splice(index, 1);
    newPerguntas.push(''); // Keep array length at 5
    handleSelectChange('perguntas', JSON.stringify(newPerguntas));
  };

  return (
    <div className="space-y-6">
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

      <div>
        <Label htmlFor="detalhes_solicitacao" className={`block ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}>
          Detalhes da Solicitação
        </Label>
        <Textarea
          id="detalhes_solicitacao"
          name="detalhes_solicitacao"
          value={formData.detalhes_solicitacao}
          onChange={handleChange}
          rows={5}
          className={hasError('detalhes_solicitacao') ? 'border-orange-500' : ''}
        />
        {hasError('detalhes_solicitacao') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
        )}
      </div>
    </div>
  );
};

export default QuestionsDetailsStep;
