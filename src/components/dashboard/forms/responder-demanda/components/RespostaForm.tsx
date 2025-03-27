
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RespostaFormHeader from './RespostaFormHeader';
import FormFooter from './FormFooter';
import DemandaMetadataSection from './sections/DemandaMetadataSection';
import ServicoSection from './sections/ServicoSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import AttachmentsSection from './AttachmentsSection';
import { Paperclip, MessageSquare, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRespostaFormState } from '../hooks/useRespostaFormState';

interface RespostaFormProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onBack?: () => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
  comentarios?: string;
  setComentarios?: React.Dispatch<React.SetStateAction<string>>;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  onBack,
  isLoading,
  onSubmit,
  comentarios = '',
  setComentarios
}) => {
  const {
    handleRespostaChange,
    updateService,
    allQuestionsAnswered,
  } = useRespostaFormState({
    selectedDemanda,
    resposta,
    setResposta,
  });

  const handleSubmitWithExtra = async () => {
    try {
      await updateService();
      await onSubmit();

      toast({
        title: "Resposta enviada!",
        description: "Demanda respondida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      toast({ 
        variant: "destructive", 
        title: "Erro ao enviar resposta",
        description: "Ocorreu um erro ao enviar a resposta. Tente novamente."
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <RespostaFormHeader selectedDemanda={selectedDemanda} onBack={onBack} />

      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <DemandaMetadataSection selectedDemanda={selectedDemanda} />

          <ServicoSection selectedDemanda={selectedDemanda} />

          {selectedDemanda.detalhes_solicitacao && (
            <div className="space-y-2">
              <h3 className="font-semibold text-subpi-blue">Detalhes da Solicitação</h3>
              <Card className="bg-blue-50 p-4 rounded-xl">
                <p>{selectedDemanda.detalhes_solicitacao}</p>
              </Card>
            </div>
          )}

          {selectedDemanda.perguntas && (
            <div className="space-y-2">
              <h3 className="font-semibold text-subpi-blue flex items-center gap-2">
                <HelpCircle className="h-5 w-5" /> Perguntas e Respostas
              </h3>
              <QuestionsAnswersSection
                perguntas={selectedDemanda.perguntas}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
              />
            </div>
          )}

          {(selectedDemanda.arquivo_url || selectedDemanda.anexos?.length > 0) && (
            <div>
              <h3 className="font-semibold text-subpi-blue flex items-center gap-2">
                <Paperclip className="h-5 w-5" /> Anexos
              </h3>
              <AttachmentsSection selectedDemanda={selectedDemanda} />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-subpi-blue flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Comentários
            </h3>
            <CommentsSection
              comentarios={comentarios}
              setComentarios={setComentarios}
              placeholder="Tem mais alguma informação?"
            />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-white sticky bottom-0">
          <FormFooter
            isLoading={isLoading}
            onSubmit={handleSubmitWithExtra}
            disabled={!allQuestionsAnswered()}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RespostaForm;
