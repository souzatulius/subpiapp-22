
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
  // Processar as perguntas - converter de string para objeto/array se necessário
  const processedPerguntas = React.useMemo(() => {
    if (!selectedDemanda.perguntas) return null;
    
    // Se já for um objeto ou array, retornar como está
    if (typeof selectedDemanda.perguntas !== 'string') {
      return selectedDemanda.perguntas;
    }
    
    // Tentar fazer o parse da string JSON
    try {
      return JSON.parse(selectedDemanda.perguntas);
    } catch (e) {
      // Se não for um JSON válido, retornar a própria string
      return selectedDemanda.perguntas;
    }
  }, [selectedDemanda.perguntas]);

  // Função melhorada para verificar se existem perguntas
  const hasQuestions = () => {
    if (!processedPerguntas) return false;
    
    // Se for uma array vazia
    if (Array.isArray(processedPerguntas) && processedPerguntas.length === 0) return false;
    
    // Se for um objeto vazio
    if (typeof processedPerguntas === 'object' && !Array.isArray(processedPerguntas)) {
      if (Object.keys(processedPerguntas).length === 0) return false;
      
      // Verifica se há pelo menos uma pergunta não vazia
      return Object.values(processedPerguntas).some(pergunta => 
        pergunta && String(pergunta).trim() !== ''
      );
    }
    
    // Se for uma string
    if (typeof processedPerguntas === 'string') {
      return processedPerguntas.trim() !== '';
    }
    
    return true;
  };

  return (
    <TabsContent value="questions" className="pt-2 m-0 animate-fade-in">
      {hasQuestions() ? (
        <QuestionsAnswersSection 
          perguntas={processedPerguntas}
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
