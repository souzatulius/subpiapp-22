import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RespostaFormHeader from './RespostaFormHeader';
import FormFooter from './FormFooter';
import DemandaMetadataSection from './sections/DemandaMetadataSection';
import TemaServicoSection from './sections/TemaServicoSection';
import DemandaDetailsSection from './DemandaDetailsSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import AttachmentsSection from './AttachmentsSection';
import { useProblemsData } from '@/hooks/problems';
import { useServicosData } from '@/hooks/demandForm/useServicosData';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useRespostaFormState } from '../hooks/useRespostaFormState';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import { toast } from '@/components/ui/use-toast';
import { MessageSquare, Paperclip } from 'lucide-react';

interface RespostaFormProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onBack: () => void;
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
  const [localComentarios, setLocalComentarios] = React.useState<string>(comentarios);
  
  const { problems, isLoading: problemsLoading } = useProblemsData();
  const { servicos, isLoading: servicosLoading } = useServicosData();

  const {
    selectedProblemId,
    selectedServicoId,
    dontKnowService,
    setSelectedProblemId,
    setSelectedServicoId,
    handleServiceToggle,
    handleRespostaChange,
    updateService,
    allQuestionsAnswered,
    handleViewAttachment,
    handleDownloadAttachment
  } = useRespostaFormState({
    selectedDemanda,
    resposta,
    setResposta,
  });

  const { clearFormStorage } = useFormPersistence({
    demandaId: selectedDemanda?.id,
    resposta,
    comentarios: setComentarios ? comentarios : localComentarios,
    setResposta,
    setComentarios,
    setLocalComentarios,
    activeTab: 'single',
    setActiveTab: () => {}
  });

  React.useEffect(() => {
    if (setComentarios) {
      setComentarios(localComentarios);
    }
  }, [localComentarios, setComentarios]);

  const currentProblem = problems.find(p => p.id === selectedProblemId);

  const getQuestionStats = () => {
    if (!selectedDemanda?.perguntas) return { answered: 0, total: 0 };
    
    const normalizedQuestions = normalizeQuestions(selectedDemanda.perguntas);
    let answered = 0;
    
    normalizedQuestions.forEach((_, index) => {
      if (resposta[index.toString()] && resposta[index.toString()].trim() !== '') {
        answered++;
      }
    });
    
    return { answered, total: normalizedQuestions.length };
  };

  const handleSubmitWithExtra = async () => {
    try {
      await updateService();
      
      await onSubmit();
      
      clearFormStorage();

      toast({
        title: "Resposta enviada com sucesso!",
        description: "Os dados foram salvos e a demanda foi respondida.",
        variant: "success"
      });
      
    } catch (error) {
      console.error('Erro ao salvar informações adicionais:', error);
      
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um problema ao salvar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleComentariosChange = (value: string) => {
    if (setComentarios) {
      setComentarios(value);
    } else {
      setLocalComentarios(value);
    }
  };

  if (!selectedDemanda) return null;
  
  const { answered, total } = getQuestionStats();
  const hasPerguntas = total > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <RespostaFormHeader 
        selectedDemanda={selectedDemanda} 
        onBack={onBack} 
      />
      
      <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 space-y-8">
          <DemandaMetadataSection 
            selectedDemanda={selectedDemanda}
            currentProblem={currentProblem}
          />
          
          <TemaServicoSection 
            currentProblem={currentProblem}
            selectedDemanda={selectedDemanda}
            selectedServicoId={selectedServicoId}
            dontKnowService={dontKnowService}
            servicos={servicos}
            servicosLoading={servicosLoading}
            onServicoChange={setSelectedServicoId}
            onServiceToggle={handleServiceToggle}
          />
          
          {selectedDemanda.detalhes_solicitacao && (
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold text-subpi-blue mb-4">Detalhes da Solicitação</h3>
              <Card className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl shadow-sm">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedDemanda.detalhes_solicitacao}</p>
              </Card>
            </div>
          )}
          
          {hasPerguntas && (
            <div className="py-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-subpi-blue">Perguntas e Respostas</h3>
              </div>
              
              <QuestionsAnswersSection
                perguntas={selectedDemanda.perguntas}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
              />
            </div>
          )}
          
          {(selectedDemanda.arquivo_url || (selectedDemanda.anexos && selectedDemanda.anexos.length > 0)) && (
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold text-subpi-blue mb-4 flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Anexos
              </h3>
              
              <AttachmentsSection
                arquivo_url={selectedDemanda.arquivo_url}
                anexos={selectedDemanda.anexos}
                onViewAttachment={handleViewAttachment}
                onDownloadAttachment={handleDownloadAttachment}
              />
            </div>
          )}
          
          <div className="py-6">
            <h3 className="text-lg font-semibold text-subpi-blue mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comentários Internos
            </h3>
            
            <CommentsSection
              comentarios={setComentarios ? comentarios : localComentarios}
              onChange={handleComentariosChange}
              simplifiedText={true}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 sticky bottom-0 bg-white shadow-md z-10 flex justify-between">
          <FormFooter 
            isLoading={isLoading}
            allQuestionsAnswered={allQuestionsAnswered()}
            onSubmit={handleSubmitWithExtra}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RespostaForm;
