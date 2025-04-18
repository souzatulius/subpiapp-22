
import React, { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
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
  const normalizedQuestions = normalizeQuestions(perguntas);

  useEffect(() => {
    normalizedQuestions.forEach((_, index) => {
      const key = index.toString();
      if (resposta[key] === undefined) {
        onRespostaChange(key, '');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuestions]); // Run when normalized questions change

  if (!perguntas || normalizedQuestions.length === 0) {
    return (
      <Card className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200">
        <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        {normalizedQuestions.map((pergunta: string, index: number) => (
          <Card
            key={`question-${index}`}
            className="overflow-hidden border-gray-200 hover:shadow-md transition-all duration-300 rounded-xl"
          >
            <CardContent className="p-0">
              <div className="bg-gray-100 p-4 text-gray-800 rounded-t-xl">
                <p className="text-base font-semibold">{pergunta}</p>
              </div>
              <div className="p-4">
                <Textarea
                  id={`resposta-${index}`}
                  placeholder="Digite sua resposta"
                  className="min-h-[120px] w-full border border-gray-300 focus:border-blue-400 focus:ring-blue-300 rounded-xl"
                  value={resposta[index.toString()] ?? ''}
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
