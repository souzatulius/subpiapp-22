
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, SendHorizontal, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Demanda } from '../types';
import RespostaFormHeader from './RespostaFormHeader';
import TabsNavigation from './TabsNavigation';
import DetailsTab from './DetailsTab';
import QuestionsTab from './QuestionsTab';
import CommentsTab from './CommentsTab';

interface RespostaFormProps {
  selectedDemanda: Demanda;
  resposta: Record<string, string>;
  comentarios: string;
  setResposta: (resposta: Record<string, string>) => void;
  setComentarios: (comentarios: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
  handleRespostaChange: (key: string, value: string) => void;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  comentarios,
  setResposta,
  setComentarios,
  onBack,
  isLoading,
  onSubmit,
  handleRespostaChange,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('details');
  const perguntas = selectedDemanda.perguntas || {};
  
  // Check if all questions have been answered
  const allQuestionsAnswered = Object.keys(perguntas).every(
    (key) => resposta[key] && resposta[key].trim() !== ''
  );
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost"
          onClick={onBack} 
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <RespostaFormHeader selectedDemanda={selectedDemanda} />
      
      <TabsNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <div className="mt-6">
        {activeTab === 'details' && (
          <DetailsTab selectedDemanda={selectedDemanda} />
        )}
        
        {activeTab === 'questions' && (
          <QuestionsTab 
            selectedDemanda={selectedDemanda} 
            resposta={resposta}
            handleRespostaChange={handleRespostaChange}
          />
        )}
        
        {activeTab === 'comments' && (
          <CommentsTab 
            comentarios={comentarios} 
            setComentarios={setComentarios} 
          />
        )}
      </div>
      
      <div className="flex justify-end pt-4 border-t">
        <Button 
          disabled={!allQuestionsAnswered || isLoading} 
          onClick={onSubmit}
          className="bg-subpi-blue hover:bg-subpi-blue/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Enviando...
            </>
          ) : (
            <>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Enviar resposta
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RespostaForm;
