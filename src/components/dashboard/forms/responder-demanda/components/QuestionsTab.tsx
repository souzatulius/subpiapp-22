
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
  // Função para verificar se existem perguntas
  const hasQuestions = () => {
    if (!selectedDemanda.perguntas) return false;
    
    if (Array.isArray(selectedDemanda.perguntas)) {
      return selectedDemanda.perguntas.length > 0;
    }
    
    if (typeof selectedDemanda.perguntas === 'object') {
      return Object.keys(selectedDemanda.perguntas).length > 0;
    }
    
    if (typeof selectedDemanda.perguntas === 'string') {
      try {
        const parsed = JSON.parse(selectedDemanda.perguntas);
        if (Array.isArray(parsed)) {
          return parsed.length > 0;
        }
        if (typeof parsed === 'object') {
          return Object.keys(parsed).length > 0;
        }
      } catch {
        // Se não conseguir parsear, considera a string como uma pergunta
        return selectedDemanda.perguntas.trim() !== '';
      }
    }
    
    return false;
  };

  console.log('Tipo das perguntas:', typeof selectedDemanda.perguntas);
  console.log('Conteúdo das perguntas:', selectedDemanda.perguntas);
  console.log('Has questions:', hasQuestions());

  return (
    <TabsContent value="questions" className="pt-2 m-0 animate-fade-in">
      {hasQuestions() ? (
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
