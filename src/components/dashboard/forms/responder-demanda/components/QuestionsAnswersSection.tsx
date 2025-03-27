import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  if (!perguntas) return null;

  const normalizeQuestions = () => {
    if (!perguntas) return [];

    if (Array.isArray(perguntas)) {
      return perguntas.filter(p => typeof p === 'string' && p.trim() !== '');
    }

    if (typeof perguntas === 'object') {
      return Object.values(perguntas).filter(p => typeof p === 'string' && p.trim() !== '');
    }

    if (typeof perguntas === 'string') {
      try {
        const parsed = JSON.parse(perguntas);
        if (Array.isArray(parsed)) return parsed.filter(p => typeof p === 'string' && p.trim() !== '');
        if (typeof parsed === 'object') return Object.values(parsed).filter(p => typeof p === 'string' && p.trim() !== '');
      } catch {
        return [perguntas];
      }
    }

    return [];
  };

  const normalizedQuestions = normalizeQuestions();

  const getTotalAnswered = () => {
    let answered = 0;
    const total = normalizedQuestions.length;

    normalizedQuestions.forEach((_, index) => {
      if (resposta[index.toString()]?.trim() !== '') answered++;
    });

    return { answered, total };
  };

  const { answered, total } = getTotalAnswered();

  return (
    <div className="space-y-5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-subpi-blue">Perguntas e Respostas</h3>
        <Badge
          variant={answered === total ? 'default' : 'outline'}
          className={`transition-colors duration-300 ${
            answered === total
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
          }`}
        >
          <span className="font-medium">{answered}</span> de <span className="font-medium">{total}</span> respondidas
        </Badge>
      </div>

      <div className="space-y-5">
        {normalizedQuestions.length > 0 ? (
          normalizedQuestions.map((pergunta: string, index: number) => (
            <Card
              key={index}
              className="overflow-hidden border border-blue-100 bg-white hover:shadow-md transition-all duration-300 animate-fade-in"
            >
              <CardContent className="p-0">
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <Label className="font-medium text-blue-800">Pergunta {index + 1}:</Label>
                  <p className="mt-1 text-blue-900">{pergunta}</p>
                </div>
                <div className="p-4">
                  <Label htmlFor={`resposta-${index}`} className="text-sm font-medium text-gray-700 block mb-1">
                    Sua resposta:
                  </Label>
                  <Textarea
                    id={`resposta-${index}`}
                    placeholder="Digite sua resposta para essa pergunta"
                    className="min-h-[120px] w-full border-gray-300 focus:border-subpi-blue focus:ring-subpi-blue"
                    value={resposta[index.toString()] || ''}
                    onChange={(e) => onRespostaChange(index.toString(), e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200 animate-fade-in hover:shadow-md transition-all duration-300">
            <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionsAnswersSection;
