
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
  // Função melhorada para verificar se existem perguntas
  const hasQuestions = () => {
    if (!selectedDemanda.perguntas) return false;
    
    // Se for uma array vazia
    if (Array.isArray(selectedDemanda.perguntas) && selectedDemanda.perguntas.length === 0) return false;
    
    // Se for um objeto vazio
    if (typeof selectedDemanda.perguntas === 'object' && !Array.isArray(selectedDemanda.perguntas)) {
      if (Object.keys(selectedDemanda.perguntas).length === 0) return false;
      
      // Verifica se há pelo menos uma pergunta não vazia
      return Object.values(selectedDemanda.perguntas).some(pergunta => 
        pergunta && String(pergunta).trim() !== ''
      );
    }
    
    // Se for uma string JSON, tenta parsear
    if (typeof selectedDemanda.perguntas === 'string') {
      try {
        const parsed = JSON.parse(selectedDemanda.perguntas);
        
        if (Array.isArray(parsed) && parsed.length === 0) return false;
        
        if (typeof parsed === 'object' && Object.keys(parsed).length === 0) return false;
        
        return true;
      } catch {
        // Se não conseguir parsear, verifica se a string não está vazia
        return selectedDemanda.perguntas.trim() !== '';
      }
    }
    
    return true;
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
