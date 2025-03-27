
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

// Custom hooks
import { useProblemsData } from '@/hooks/problems';
import { useServicosData } from '@/hooks/demandForm/useServicosData';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useRespostaFormState } from '../hooks/useRespostaFormState';

// Components
import RespostaFormHeader from './RespostaFormHeader';
import TabsNavigation from './TabsNavigation';
import DetailsTab from './DetailsTab';
import CommentsTab from './CommentsTab';
import FormFooter from './FormFooter';

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
  const [activeTab, setActiveTab] = useState<string>('details');
  const [localComentarios, setLocalComentarios] = useState<string>(comentarios);
  
  const { problems, isLoading: problemsLoading } = useProblemsData();
  const { servicos, isLoading: servicosLoading } = useServicosData();

  // Use custom hooks for form state management
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

  // Use custom hook for form persistence
  const { clearFormStorage } = useFormPersistence({
    demandaId: selectedDemanda?.id,
    resposta,
    comentarios: setComentarios ? comentarios : localComentarios,
    setResposta,
    setComentarios,
    setLocalComentarios,
    activeTab,
    setActiveTab
  });

  // Sync local comments with parent component
  useEffect(() => {
    if (setComentarios) {
      setComentarios(localComentarios);
    }
  }, [localComentarios, setComentarios]);

  // Find the current theme/problem
  const currentProblem = problems.find(p => p.id === selectedProblemId);

  const handleSubmitWithExtra = async () => {
    try {
      // Atualizar o serviço selecionado (se houver)
      await updateService();
      
      // Chamar o onSubmit original que salva as respostas
      await onSubmit();
      
      // Limpar dados do sessionStorage após envio bem-sucedido
      clearFormStorage();

      // Mostrar toast de sucesso
      toast({
        title: "Resposta enviada com sucesso!",
        description: "Os dados foram salvos e a demanda foi respondida.",
        variant: "success"
      });
      
    } catch (error) {
      console.error('Erro ao salvar informações adicionais:', error);
      
      // Mostrar toast de erro
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um problema ao salvar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (!selectedDemanda) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <RespostaFormHeader 
          selectedDemanda={selectedDemanda} 
          onBack={onBack} 
        />
      </div>
      
      <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <TabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <CardContent className="space-y-6">
              <DetailsTab 
                selectedDemanda={selectedDemanda}
                selectedProblemId={selectedProblemId}
                selectedServicoId={selectedServicoId}
                dontKnowService={dontKnowService}
                problems={problems}
                problemsLoading={problemsLoading}
                servicos={servicos}
                servicosLoading={servicosLoading}
                currentProblem={currentProblem}
                onProblemChange={setSelectedProblemId}
                onServicoChange={setSelectedServicoId}
                onDontKnowServiceChange={handleServiceToggle}
                onViewAttachment={handleViewAttachment}
                onDownloadAttachment={handleDownloadAttachment}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
              />
              
              <CommentsTab 
                comentarios={setComentarios ? comentarios : localComentarios}
                onChange={(value) => {
                  if (setComentarios) {
                    setComentarios(value);
                  } else {
                    setLocalComentarios(value);
                  }
                }}
              />
            </CardContent>
          </TabsNavigation>
        </CardHeader>

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
