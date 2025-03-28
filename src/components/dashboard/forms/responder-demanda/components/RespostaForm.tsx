
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
  handleRespostaChange?: (key: string, value: string) => void;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  onBack,
  isLoading,
  onSubmit,
  comentarios = '',
  setComentarios,
  handleRespostaChange
}) => {
  const {
    updateService,
    allQuestionsAnswered,
    setSelectedServicoId
  } = useRespostaFormState({
    selectedDemanda,
    resposta,
    setResposta
  });

  // Use the passed handleRespostaChange function or create a default one
  const onRespostaChange = handleRespostaChange || ((key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  });

  const handleServiceChange = (serviceId: string) => {
    setSelectedServicoId(serviceId);
  };
  
  const handleSubmitWithExtra = async () => {
    try {
      await updateService();
      await onSubmit();
      toast({
        title: "Resposta enviada!",
        description: "Demanda respondida com sucesso."
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
      <RespostaFormHeader selectedDemanda={selectedDemanda} />

      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <DemandaMetadataSection selectedDemanda={selectedDemanda} />

          <ServicoSection 
            selectedDemanda={selectedDemanda} 
            onServiceChange={handleServiceChange}
          />

          {selectedDemanda.detalhes_solicitacao && (
            <div className="space-y-2">
              <h3 className="font-semibold text-subpi-blue">Detalhes da Solicitação</h3>
              <Card className="bg-blue-50 p-4 rounded-xl">
                <p className="leading-relaxed py-[15px] px-[25px]">{selectedDemanda.detalhes_solicitacao}</p>
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
                onRespostaChange={onRespostaChange} 
              />
            </div>
          )}

          {(selectedDemanda.arquivo_url || selectedDemanda.anexos?.length > 0) && (
            <div>
              <h3 className="font-semibold text-subpi-blue flex items-center gap-2">
                <Paperclip className="h-5 w-5" /> Anexos
              </h3>
              <AttachmentsSection 
                arquivo_url={selectedDemanda.arquivo_url} 
                anexos={selectedDemanda.anexos}
                onViewAttachment={url => window.open(url, '_blank')}
                onDownloadAttachment={url => window.open(url, '_blank')}
              />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-subpi-blue flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Comentários
            </h3>
            <CommentsSection 
              comentarios={comentarios} 
              onChange={setComentarios ? value => setComentarios(value) : () => {}} 
              placeholder="Tem mais alguma informação?" 
              simplifiedText={true} 
            />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-white sticky bottom-0">
          <FormFooter 
            isLoading={isLoading} 
            onSubmit={handleSubmitWithExtra} 
            allQuestionsAnswered={allQuestionsAnswered()} 
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RespostaForm;
