
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import { Card } from '@/components/ui/card';

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
  return (
    <TabsContent value="questions" className="pt-2 m-0 animate-fade-in">
      {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 ? (
        <QuestionsAnswersSection 
          perguntas={selectedDemanda.perguntas}
          resposta={resposta}
          onRespostaChange={onRespostaChange}
        />
      ) : (
        <Card className="bg-gray-50 p-6 rounded-xl text-center shadow-sm border border-gray-200 animate-fade-in hover:shadow-md transition-all duration-300">
          <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
        </Card>
      )}
    </TabsContent>
  );
};

export default QuestionsTab;
