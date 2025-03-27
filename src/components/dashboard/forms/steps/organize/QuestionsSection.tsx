
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface QuestionsSectionProps {
  questions: string[];
  onQuestionChange: (index: number, value: string) => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({ questions, onQuestionChange }) => {
  // Only show next question field if the previous one has content
  const visibleQuestions = questions.reduce((count, question, index) => {
    if (index === 0 || (index > 0 && questions[index - 1].trim() !== '')) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <div className="space-y-4">
      <Label className="font-semibold">Perguntas</Label>
      <p className="text-sm text-gray-600">
        Adicione perguntas específicas para ajudar a equipe a entender melhor a solicitação
      </p>
      
      <div className="space-y-3">
        {questions.slice(0, visibleQuestions).map((question, index) => (
          <div key={index}>
            <Textarea
              value={question}
              onChange={(e) => onQuestionChange(index, e.target.value)}
              className="min-h-24"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsSection;
