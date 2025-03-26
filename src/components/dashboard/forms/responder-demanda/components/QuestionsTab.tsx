
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import QuestionsAnswersSection from './QuestionsAnswersSection';

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
        <div className="bg-gray-50 p-6 rounded-xl text-center animate-fade-in">
          <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
        </div>
      )}
    </TabsContent>
  );
};

export default QuestionsTab;
