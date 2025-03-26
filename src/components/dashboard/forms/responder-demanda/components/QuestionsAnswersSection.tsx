
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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
  
  // Count answered questions
  const getTotalAnswered = () => {
    let answered = 0;
    let total = 0;
    
    if (Array.isArray(perguntas)) {
      total = perguntas.length;
      perguntas.forEach((_, index) => {
        if (resposta[index.toString()] && resposta[index.toString()].trim() !== '') {
          answered++;
        }
      });
    } else {
      total = Object.keys(perguntas).length;
      Object.keys(perguntas).forEach(key => {
        if (resposta[key] && resposta[key].trim() !== '') {
          answered++;
        }
      });
    }
    
    return { answered, total };
  };
  
  const { answered, total } = getTotalAnswered();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-blue-700">Perguntas e Respostas</h3>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{answered}</span> de <span className="font-medium">{total}</span> respondidas
        </div>
      </div>
      
      <div className="space-y-5">
        {Array.isArray(perguntas) ? (
          perguntas.map((pergunta: string, index: number) => (
            <Card key={index} className="overflow-hidden border-blue-100">
              <CardContent className="p-0">
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <Label className="font-medium text-blue-800">Pergunta {index+1}:</Label>
                  <p className="mt-1 text-blue-900">{pergunta}</p>
                </div>
                <div className="p-4">
                  <Label htmlFor={`resposta-${index}`} className="text-sm font-medium text-gray-700 mb-2 block">
                    Sua resposta:
                  </Label>
                  <Textarea 
                    id={`resposta-${index}`}
                    placeholder="Digite sua resposta"
                    className="min-h-[120px] w-full border-gray-300 focus:border-blue-400 focus:ring-blue-300"
                    value={resposta[index.toString()] || ''}
                    onChange={(e) => onRespostaChange(index.toString(), e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          Object.entries(perguntas).map(([key, pergunta]) => (
            <Card key={key} className="overflow-hidden border-blue-100">
              <CardContent className="p-0">
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <Label className="font-medium text-blue-800">Pergunta:</Label>
                  <p className="mt-1 text-blue-900">{pergunta as string}</p>
                </div>
                <div className="p-4">
                  <Label htmlFor={`resposta-${key}`} className="text-sm font-medium text-gray-700 mb-2 block">
                    Sua resposta:
                  </Label>
                  <Textarea 
                    id={`resposta-${key}`}
                    placeholder="Digite sua resposta"
                    className="min-h-[120px] w-full border-gray-300 focus:border-blue-400 focus:ring-blue-300"
                    value={resposta[key] || ''}
                    onChange={(e) => onRespostaChange(key, e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionsAnswersSection;
