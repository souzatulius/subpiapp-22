
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Demanda } from '../types';
import RespostaFormHeader from './RespostaFormHeader';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import FormFooter from './FormFooter';
import DemandaMetadataSection from './sections/DemandaMetadataSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import { Separator } from '@/components/ui/separator';

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
  hideBackButton?: boolean;
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
  hideBackButton = false
}) => {
  // Check if all questions have been answered
  const normalizedQuestions = React.useMemo(() => 
    normalizeQuestions(selectedDemanda.perguntas || {}),
    [selectedDemanda.perguntas]
  );
  
  const allQuestionsAnswered = React.useMemo(() => {
    if (normalizedQuestions.length === 0) return true;
    
    return normalizedQuestions.every((_, index) => {
      const key = index.toString();
      return resposta[key] && resposta[key].trim() !== '';
    });
  }, [normalizedQuestions, resposta]);
  
  return (
    <div className="space-y-6">
      {/* Back button (only if not hidden) */}
      {!hideBackButton && (
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
      )}
      
      <RespostaFormHeader selectedDemanda={selectedDemanda} />
      
      {/* Seção de metadados da demanda - agora expandida a 100% do container */}
      <div className="p-6 space-y-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Seção de metadados da demanda */}
        <DemandaMetadataSection selectedDemanda={selectedDemanda} />
        
        <Separator />
        
        {/* Seção de detalhes da solicitação */}
        {selectedDemanda.detalhes_solicitacao && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-subpi-blue">Detalhes da Solicitação</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedDemanda.detalhes_solicitacao}
              </p>
            </div>
          </div>
        )}
        
        <Separator />
        
        {/* Seção de perguntas e respostas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-subpi-blue">Perguntas e Respostas</h3>
          <QuestionsAnswersSection
            perguntas={selectedDemanda.perguntas}
            resposta={resposta}
            onRespostaChange={handleRespostaChange}
          />
        </div>
        
        <Separator />
        
        {/* Seção de comentários */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-subpi-blue">Comentários Internos</h3>
          <CommentsSection
            comentarios={comentarios}
            onChange={setComentarios}
          />
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t">
        <FormFooter 
          isLoading={isLoading}
          allQuestionsAnswered={allQuestionsAnswered}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default RespostaForm;
