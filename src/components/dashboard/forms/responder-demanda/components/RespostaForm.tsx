
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useProblemsData } from '@/hooks/problems';
import { useServicosData } from '@/hooks/demandForm/useServicosData';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useRespostaFormState } from '../hooks/useRespostaFormState';
import RespostaFormHeader from './RespostaFormHeader';
import FormFooter from './FormFooter';
import { Badge } from '@/components/ui/badge';
import DemandaDetailsSection from './DemandaDetailsSection';
import DemandaInfoSection from './DemandaInfoSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import AttachmentsSection from './AttachmentsSection';
import TemaSelector from './TemaSelector';
import ServicoSelector from './ServicoSelector';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Calendar, Clock, Flag, BookOpen, MessageSquare, PaperclipIcon, Send } from 'lucide-react';

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
    activeTab: 'single',
    setActiveTab: () => {}
  });

  // Sync local comments with parent component
  useEffect(() => {
    if (setComentarios) {
      setComentarios(localComentarios);
    }
  }, [localComentarios, setComentarios]);

  // Find the current theme/problem
  const currentProblem = problems.find(p => p.id === selectedProblemId);

  // Get question count stats
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
      // Update selected service (if any)
      await updateService();
      
      // Call the original onSubmit to save responses
      await onSubmit();
      
      // Clear data from sessionStorage after successful submission
      clearFormStorage();

      // Show success toast
      toast({
        title: "Resposta enviada com sucesso!",
        description: "Os dados foram salvos e a demanda foi respondida.",
        variant: "success"
      });
      
    } catch (error) {
      console.error('Erro ao salvar informações adicionais:', error);
      
      // Show error toast
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um problema ao salvar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Helper function to handle comentarios changes
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
      <div className="flex items-center justify-between mb-4">
        <RespostaFormHeader 
          selectedDemanda={selectedDemanda} 
          onBack={onBack} 
        />
      </div>
      
      <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 space-y-8">
          {/* Bloco Superior - Resumo da Demanda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-subpi-blue">{selectedDemanda.titulo || 'Sem título definido'}</h3>
              
              {selectedDemanda.endereco && (
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
                  <span>{selectedDemanda.endereco}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-2">
                {currentProblem && (
                  <Badge className="px-3 py-1.5 bg-blue-50 text-subpi-blue border border-blue-100">
                    {currentProblem.descricao}
                  </Badge>
                )}
                
                <Badge 
                  className={`px-3 py-1.5 ${
                    selectedDemanda.prioridade === 'alta' ? 'bg-red-50 text-red-700 border border-red-200' : 
                    selectedDemanda.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                    'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  Prioridade: {
                    selectedDemanda.prioridade === 'alta' ? 'Alta' : 
                    selectedDemanda.prioridade === 'media' ? 'Média' : 'Baixa'
                  }
                </Badge>
                
                {selectedDemanda.status && (
                  <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5">
                    Status: {selectedDemanda.status}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm text-gray-500">Criado em:</span>
                  <p className="font-medium">{new Date(selectedDemanda.horario_publicacao).toLocaleDateString('pt-BR')} às {new Date(selectedDemanda.horario_publicacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              
              {selectedDemanda.prazo_resposta && (
                <div className="flex items-start gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500">Prazo para resposta:</span>
                    <p className="font-medium">{new Date(selectedDemanda.prazo_resposta).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}
              
              {selectedDemanda.origem && (
                <div className="flex items-start gap-2 text-gray-700">
                  <BookOpen className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500">Origem:</span>
                    <p className="font-medium">{selectedDemanda.origem.descricao || 'Não informado'}</p>
                  </div>
                </div>
              )}
              
              {selectedDemanda.veiculo_imprensa && (
                <div className="flex items-start gap-2 text-gray-700">
                  <MessageSquare className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500">Veículo:</span>
                    <p className="font-medium">{selectedDemanda.veiculo_imprensa}</p>
                  </div>
                </div>
              )}
              
              {selectedDemanda.autor && (
                <div className="flex items-start gap-2 text-gray-700">
                  <User className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500">Autor:</span>
                    <p className="font-medium">{selectedDemanda.autor.nome_completo || 'Não informado'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Informações do Solicitante */}
          {(selectedDemanda.nome_solicitante || selectedDemanda.email_solicitante || selectedDemanda.telefone_solicitante) && (
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold text-subpi-blue mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Solicitante
              </h3>
              
              <Card className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedDemanda.nome_solicitante && (
                    <div>
                      <span className="text-sm text-gray-500">Nome:</span>
                      <p className="font-medium">{selectedDemanda.nome_solicitante}</p>
                    </div>
                  )}
                  
                  {selectedDemanda.email_solicitante && (
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{selectedDemanda.email_solicitante}</p>
                    </div>
                  )}
                  
                  {selectedDemanda.telefone_solicitante && (
                    <div>
                      <span className="text-sm text-gray-500">Telefone:</span>
                      <p className="font-medium">{selectedDemanda.telefone_solicitante}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
          
          {/* Detalhes da Solicitação */}
          {selectedDemanda.detalhes_solicitacao && (
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold text-subpi-blue mb-4">Detalhes da Solicitação</h3>
              <Card className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl shadow-sm">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedDemanda.detalhes_solicitacao}</p>
              </Card>
            </div>
          )}
          
          {/* Tema e Serviço */}
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold text-subpi-blue mb-4">Tema e Serviço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tema:</h4>
                <TemaSelector
                  selectedProblemId={selectedProblemId}
                  problems={problems}
                  problemsLoading={problemsLoading}
                  onProblemChange={setSelectedProblemId}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Serviço:</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="dontKnowService"
                      checked={dontKnowService}
                      onChange={handleServiceToggle}
                      className="rounded border-gray-300 text-subpi-blue focus:ring-subpi-blue"
                    />
                    <label htmlFor="dontKnowService" className="text-sm text-gray-700">
                      Não sei informar o serviço
                    </label>
                  </div>
                </div>
                
                {!dontKnowService && (
                  <ServicoSelector
                    selectedServicoId={selectedServicoId}
                    servicos={servicos}
                    servicosLoading={servicosLoading}
                    onServicoChange={setSelectedServicoId}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Perguntas e Respostas */}
          {hasPerguntas && (
            <div className="py-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-subpi-blue">Perguntas e Respostas</h3>
                <Badge 
                  variant={answered === total ? "default" : "outline"} 
                  className={`${answered === total ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'} transition-colors duration-300`}
                >
                  <span className="font-medium">{answered}</span> de <span className="font-medium">{total}</span> respondidas
                </Badge>
              </div>
              
              <QuestionsAnswersSection
                perguntas={selectedDemanda.perguntas}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
              />
            </div>
          )}
          
          {/* Anexos */}
          {(selectedDemanda.arquivo_url || (selectedDemanda.anexos && selectedDemanda.anexos.length > 0)) && (
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold text-subpi-blue mb-4 flex items-center gap-2">
                <PaperclipIcon className="h-5 w-5" />
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
          
          {/* Comentários Internos */}
          <div className="py-6">
            <h3 className="text-lg font-semibold text-subpi-blue mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comentários Internos
            </h3>
            
            <CommentsSection
              comentarios={setComentarios ? comentarios : localComentarios}
              onChange={handleComentariosChange}
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
