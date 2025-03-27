
import React from 'react';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import { Card } from '@/components/ui/card';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

interface QuestionsTabProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  onRespostaChange: (key: string, value: string) => void;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({
  selectedDemanda,
  resposta,
  onRespostaChange
}) => {
  // This component is now just a wrapper for QuestionsAnswersSection
  // and is kept for backward compatibility
  
  // Check if there are questions
  const hasQuestions = React.useMemo(() => {
    const normalized = normalizeQuestions(selectedDemanda.perguntas);
    return normalized.length > 0;
  }, [selectedDemanda.perguntas]);

  return (
    hasQuestions ? (
      <QuestionsAnswersSection 
        perguntas={selectedDemanda.perguntas}
        resposta={resposta}
        onRespostaChange={onRespostaChange}
      />
    ) : (
      <Card className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200 animate-fade-in hover:shadow-md transition-all duration-300">
        <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
      </Card>
    )
  );
};

export default QuestionsTab;
