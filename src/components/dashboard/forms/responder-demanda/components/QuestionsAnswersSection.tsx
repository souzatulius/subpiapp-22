
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface QuestionsAnswersSectionProps {
  perguntas: string[] | Record<string, string> | null;
  resposta: Record<string, string>;
  onRespostaChange: (key: string, value: string) => void;
}

const QuestionsAnswersSection: React.FC<QuestionsAnswersSectionProps> = ({
  perguntas,
  resposta,
  onRespostaChange
}) => {
  if (!perguntas) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Perguntas e Respostas</h3>
      
      {Array.isArray(perguntas) ? (
        perguntas.map((pergunta: string, index: number) => (
          <div key={index} className="space-y-2">
            <div className="bg-blue-50 p-3 rounded-md text-blue-800">
              <strong>Pergunta {index+1}:</strong> {pergunta}
            </div>
            <Textarea 
              placeholder="Digite sua resposta"
              className="min-h-[100px]"
              value={resposta[index.toString()] || ''}
              onChange={(e) => onRespostaChange(index.toString(), e.target.value)}
            />
          </div>
        ))
      ) : (
        Object.entries(perguntas).map(([key, pergunta]) => (
          <div key={key} className="space-y-2">
            <div className="bg-blue-50 p-3 rounded-md text-blue-800">
              <strong>Pergunta:</strong> {pergunta as string}
            </div>
            <Textarea 
              placeholder="Digite sua resposta"
              className="min-h-[100px]"
              value={resposta[key] || ''}
              onChange={(e) => onRespostaChange(key, e.target.value)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionsAnswersSection;
