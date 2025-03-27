
import React, { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

interface QuestionsAnswersSectionProps {
  perguntas: string[] | Record<string, string> | null | any;
  resposta: Record<string, string>;
  onRespostaChange: (key: string, value: string) => void;
}

const QuestionsAnswersSection: React.FC<QuestionsAnswersSectionProps> = ({
  perguntas,
  resposta,
  onRespostaChange
}) => {
  console.log('QuestionsAnswersSection - props perguntas:', perguntas);
  console.log('QuestionsAnswersSection - props resposta:', resposta);

  // Use our utility function to normalize questions
  const normalizedQuestions = normalizeQuestions(perguntas);
  console.log('QuestionsAnswersSection - normalizedQuestions:', normalizedQuestions);

  // Initialize response fields if they don't exist
  useEffect(() => {
    normalizedQuestions.forEach((_, index) => {
      if (!resposta[index.toString()]) {
        onRespostaChange(index.toString(), '');
      }
    });
  }, [normalizedQuestions]);

  const getTotalAnswered = () => {
    let answered = 0;
    let total = normalizedQuestions.length;
    
    normalizedQuestions.forEach((_, index) => {
      if (resposta[index.toString()] && resposta[index.toString()].trim() !== '') {
        answered++;
      }
    });
    
    return { answered, total };
  };

  const { answered, total } = getTotalAnswered();

  if (!perguntas || normalizedQuestions.length === 0) {
    return (
      <Card className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200 animate-fade-in hover:shadow-md transition-all duration-300">
        <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <Badge 
          variant={answered === total ? "default" : "outline"} 
          className={`${answered === total ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'} transition-colors duration-300`}
        >
          <span className="font-medium">{answered}</span> de <span className="font-medium">{total}</span> respondidas
        </Badge>
      </div>

      <div className="space-y-5">
        {normalizedQuestions.map((pergunta: string, index: number) => (
          <Card key={index} className="overflow-hidden border-blue-100 hover:shadow-md transition-all duration-300 animate-fade-in">
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
        ))}
      </div>
    </div>
  );
};

export default QuestionsAnswersSection;
