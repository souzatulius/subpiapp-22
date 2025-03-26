
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Download, FileIcon, Eye, File } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useProblemsData } from '@/hooks/problems';
import { useServicosData } from '@/hooks/demandForm/useServicosData';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Import sub-components
import DemandaHeader from './DemandaHeader';
import TemaSelector from './TemaSelector';
import ServicoSelector from './ServicoSelector';
import DemandaInfoSection from './DemandaInfoSection';
import DemandaDetailsSection from './DemandaDetailsSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';

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
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [selectedServicoId, setSelectedServicoId] = useState<string>('');
  const [dontKnowService, setDontKnowService] = useState<boolean>(false);
  const [localComentarios, setLocalComentarios] = useState<string>(comentarios);
  const [activeTab, setActiveTab] = useState<string>('details');
  
  const { problems, isLoading: problemsLoading } = useProblemsData();
  const { servicos, isLoading: servicosLoading } = useServicosData();

  useEffect(() => {
    if (setComentarios) {
      setComentarios(localComentarios);
    }
  }, [localComentarios, setComentarios]);

  useEffect(() => {
    if (selectedDemanda?.problema_id) {
      setSelectedProblemId(selectedDemanda.problema_id);
    }
    
    if (selectedDemanda?.perguntas) {
      const initialRespostas: Record<string, string> = {};
      
      if (Array.isArray(selectedDemanda.perguntas)) {
        selectedDemanda.perguntas.forEach((pergunta: string, index: number) => {
          initialRespostas[index.toString()] = resposta[index.toString()] || '';
        });
      } else if (typeof selectedDemanda.perguntas === 'object') {
        Object.keys(selectedDemanda.perguntas).forEach((key) => {
          initialRespostas[key] = resposta[key] || '';
        });
      }
      
      setResposta(initialRespostas);
    }

    // Inicializar o serviço selecionado
    if (selectedDemanda?.servico_id) {
      setSelectedServicoId(selectedDemanda.servico_id);
      setDontKnowService(false);
    } else {
      setDontKnowService(true);
      setSelectedServicoId('');
    }
  }, [selectedDemanda, setResposta, resposta]);

  // Handle form input changes
  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmitWithExtra = async () => {
    try {
      // Atualizar o serviço selecionado (se houver)
      if ((!dontKnowService && selectedServicoId !== selectedDemanda.servico_id) || 
          (dontKnowService && selectedDemanda.servico_id)) {
        const updatePayload: any = { 
          servico_id: dontKnowService ? null : selectedServicoId 
        };
        
        const { error: servicoError } = await supabase
          .from('demandas')
          .update(updatePayload)
          .eq('id', selectedDemanda.id);
          
        if (servicoError) throw servicoError;
      }
      
      // Chamar o onSubmit original que salva as respostas
      await onSubmit();
      
    } catch (error) {
      console.error('Erro ao salvar informações adicionais:', error);
    }
  };
  
  const allQuestionsAnswered = () => {
    if (!selectedDemanda?.perguntas) return true;
    
    const questions = Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas 
      : Object.values(selectedDemanda.perguntas);
      
    const answers = Object.values(resposta);
    
    // Se não tiver perguntas, considera que está tudo respondido
    if (questions.length === 0) return true;
    
    // Verifica se tem o mesmo número de respostas e perguntas
    if (Object.keys(resposta).length !== (Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas.length 
      : Object.keys(selectedDemanda.perguntas).length)) return false;
    
    // Verifica se todas as respostas estão preenchidas
    return !Object.values(resposta).some(answer => !answer || answer.trim() === '');
  };

  // Find the current theme/problem
  const currentProblem = problems.find(p => p.id === selectedProblemId);

  const handleServiceToggle = () => {
    setDontKnowService(!dontKnowService);
    if (!dontKnowService) {
      setSelectedServicoId('');
    }
  };

  const handleDownloadAttachment = async (url: string) => {
    window.open(url, '_blank');
  };

  const handleViewAttachment = async (url: string) => {
    window.open(url, '_blank');
  };

  // Helper function to get file extension/type
  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  // Helper to get icon based on file type
  const getFileIcon = (url: string) => {
    const type = getFileType(url);
    switch (type) {
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get filename from URL
  const getFileName = (url: string) => {
    if (!url) return 'Arquivo';
    return url.split('/').pop() || 'Arquivo';
  };

  if (!selectedDemanda) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="mr-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h2 className="text-lg font-semibold">Responder Demanda</h2>
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">Autor:</span> {selectedDemanda.autor?.nome_completo || 'Não informado'} · 
          <span className="ml-2 font-medium">Criado em:</span> {format(new Date(selectedDemanda.horario_publicacao), 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <DemandaHeader demanda={selectedDemanda} />
          
          <Tabs 
            defaultValue="details" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid grid-cols-3 w-full lg:w-auto">
              <TabsTrigger value="details">Detalhes da Demanda</TabsTrigger>
              <TabsTrigger value="questions">Perguntas e Respostas</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
            </TabsList>
        
            <CardContent className="space-y-6">
              <TabsContent value="details" className="pt-2 m-0">
                {/* Layout com duas colunas para desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Coluna 1: Informações da demanda, tema, serviço e anexos */}
                  <div className="lg:col-span-1 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Tema</h3>
                      <TemaSelector 
                        selectedProblemId={selectedProblemId}
                        problems={problems}
                        problemsLoading={problemsLoading}
                        demandaId={selectedDemanda.id}
                        currentProblem={currentProblem}
                        onProblemChange={setSelectedProblemId}
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">Serviço</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id="nao-sabe-servico" 
                          checked={dontKnowService} 
                          onCheckedChange={handleServiceToggle}
                        />
                        <label 
                          htmlFor="nao-sabe-servico" 
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          Não sei informar o serviço
                        </label>
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

                    <Separator className="my-4" />
                    
                    <DemandaInfoSection demanda={selectedDemanda} />
                    
                    {/* Anexos da demanda */}
                    {(selectedDemanda.arquivo_url || (selectedDemanda.anexos && selectedDemanda.anexos.length > 0)) && (
                      <div className="mt-4">
                        <h3 className="text-base font-medium mb-3">Anexos</h3>
                        <div className="space-y-2">
                          {selectedDemanda.arquivo_url && (
                            <div className="flex items-center p-3 bg-gray-50 rounded border border-gray-200">
                              {getFileIcon(selectedDemanda.arquivo_url)}
                              <span className="ml-2 text-sm truncate flex-1">{getFileName(selectedDemanda.arquivo_url)}</span>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewAttachment(selectedDemanda.arquivo_url)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownloadAttachment(selectedDemanda.arquivo_url)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {selectedDemanda.anexos && selectedDemanda.anexos.map((anexo: string, index: number) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded border border-gray-200">
                              {getFileIcon(anexo)}
                              <span className="ml-2 text-sm truncate flex-1">{getFileName(anexo)}</span>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewAttachment(anexo)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDownloadAttachment(anexo)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Coluna 2: Detalhes da solicitação (spans 2 cols) */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-gray-50 border border-gray-200">
                      <CardContent className="p-4">
                        <DemandaDetailsSection detalhes={selectedDemanda.detalhes_solicitacao} />
                      </CardContent>
                    </Card>
                    
                    {/* Informações do solicitante */}
                    {(selectedDemanda.nome_solicitante || selectedDemanda.email_solicitante || selectedDemanda.telefone_solicitante) && (
                      <div>
                        <h3 className="text-base font-medium mb-3">Informações do Solicitante</h3>
                        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 space-y-2">
                          {selectedDemanda.nome_solicitante && (
                            <div>
                              <span className="text-sm font-medium text-blue-700">Nome:</span>
                              <span className="text-sm ml-2 text-blue-900">{selectedDemanda.nome_solicitante}</span>
                            </div>
                          )}
                          
                          {selectedDemanda.email_solicitante && (
                            <div>
                              <span className="text-sm font-medium text-blue-700">Email:</span>
                              <span className="text-sm ml-2 text-blue-900">{selectedDemanda.email_solicitante}</span>
                            </div>
                          )}
                          
                          {selectedDemanda.telefone_solicitante && (
                            <div>
                              <span className="text-sm font-medium text-blue-700">Telefone:</span>
                              <span className="text-sm ml-2 text-blue-900">{selectedDemanda.telefone_solicitante}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="questions" className="pt-2 m-0">
                {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 ? (
                  <QuestionsAnswersSection 
                    perguntas={selectedDemanda.perguntas}
                    resposta={resposta}
                    onRespostaChange={handleRespostaChange}
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-gray-500">Não há perguntas registradas para esta demanda.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comments" className="pt-2 m-0">
                <CommentsSection 
                  comentarios={setComentarios ? comentarios : localComentarios}
                  onChange={(value) => {
                    if (setComentarios) {
                      setComentarios(value);
                    } else {
                      setLocalComentarios(value);
                    }
                  }}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>

        <CardFooter className="border-t p-4 justify-between">
          <div className="text-sm text-gray-500">
            {!allQuestionsAnswered() && (
              <div className="text-orange-500">
                Responda todas as perguntas antes de enviar
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSubmitWithExtra}
            disabled={isLoading || !allQuestionsAnswered()}
            className="space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar Resposta</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RespostaForm;
