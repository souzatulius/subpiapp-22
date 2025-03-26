
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Send, AlertTriangle, ThumbsUp, Calendar, Clock, MapPin, FileText, AlertCircle, Info, Flag } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useProblemsData } from '@/hooks/problems';
import { useServicosData } from '@/hooks/demandForm/useServicosData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { renderIcon } from '@/components/settings/problems/renderIcon';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showTemaDialog, setShowTemaDialog] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [selectedServicoId, setSelectedServicoId] = useState<string>('');
  const [localComentarios, setLocalComentarios] = useState<string>(comentarios);
  
  // Add the missing state variables
  const [originalCoordination, setOriginalCoordination] = useState<string>('');
  const [newCoordination, setNewCoordination] = useState<string>('');
  const [changingProblem, setChangingProblem] = useState<boolean>(false);
  
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
      
      const fetchOriginalCoordination = async () => {
        try {
          const { data, error } = await supabase
            .from('problemas')
            .select(`
              supervisao_tecnica_id,
              supervisoes_tecnicas:supervisao_tecnica_id (
                coordenacao_id,
                coordenacoes:coordenacao_id (
                  descricao
                )
              )
            `)
            .eq('id', selectedDemanda.problema_id)
            .single();
            
          if (error) throw error;
          
          if (data?.supervisoes_tecnicas?.coordenacoes) {
            setOriginalCoordination(data.supervisoes_tecnicas.coordenacoes.descricao);
          }
        } catch (error) {
          console.error('Error fetching original coordination:', error);
        }
      };
      
      fetchOriginalCoordination();
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
    }
  }, [selectedDemanda, setResposta, resposta]);
  
  const handleProblemChange = async (problemId: string) => {
    if (problemId === selectedDemanda.problema_id) {
      return;
    }
    
    const newProblem = problems.find(p => p.id === problemId);
    if (!newProblem || !newProblem.supervisao_tecnica) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('supervisoes_tecnicas')
        .select(`
          coordenacao_id,
          coordenacoes:coordenacao_id (
            descricao
          )
        `)
        .eq('id', newProblem.supervisao_tecnica.id)
        .single();
        
      if (error) throw error;
      
      if (data?.coordenacoes?.descricao && 
          data.coordenacoes.descricao !== originalCoordination) {
        setSelectedProblemId(problemId);
        setNewCoordination(data.coordenacoes.descricao);
        setShowAlertDialog(true);
      } else {
        await updateProblem(problemId);
      }
    } catch (error) {
      console.error('Error checking coordination change:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar a alteração de coordenação",
        variant: "destructive"
      });
    }
  };
  
  const updateProblem = async (problemId: string) => {
    try {
      setChangingProblem(true);
      
      const { error } = await supabase
        .from('demandas')
        .update({ problema_id: problemId })
        .eq('id', selectedDemanda.id);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Tema da demanda atualizado com sucesso",
      });
      
      selectedDemanda.problema_id = problemId;
      setShowTemaDialog(false);
      
    } catch (error) {
      console.error('Error updating problem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o tema da demanda",
        variant: "destructive"
      });
    } finally {
      setChangingProblem(false);
      setShowAlertDialog(false);
    }
  };
  
  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmitWithExtra = async () => {
    try {
      // Atualizar o serviço selecionado (se houver)
      if (selectedServicoId) {
        const { error: servicoError } = await supabase
          .from('demandas')
          .update({ servico_id: selectedServicoId })
          .eq('id', selectedDemanda.id);
          
        if (servicoError) throw servicoError;
      }
      
      // Salvar comentários
      if (comentarios.trim()) {
        // Será salvo junto com a resposta no onSubmit
      }
      
      // Chamar o onSubmit original que salva as respostas
      await onSubmit();
      
    } catch (error) {
      console.error('Erro ao salvar informações adicionais:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações adicionais",
        variant: "destructive"
      });
    }
  };
  
  const allQuestionsAnswered = () => {
    if (!selectedDemanda?.perguntas) return false;
    
    const questions = Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas 
      : Object.values(selectedDemanda.perguntas);
      
    const answers = Object.values(resposta);
    
    if (questions.length !== answers.length) return false;
    
    return answers.every(answer => !!answer.trim());
  };

  // Encontrar o tema atual
  const currentProblem = problems.find(p => p.id === selectedProblemId);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definido';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityText = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      default: return 'Baixa';
    }
  };

  if (!selectedDemanda) return null;

  return (
    <div className="space-y-6">
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
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{selectedDemanda.titulo}</CardTitle>
              <CardDescription>
                Criada em: {format(new Date(selectedDemanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
              </CardDescription>
            </div>
            <Badge 
              variant="outline" 
              className={getPriorityColor(selectedDemanda.prioridade)}
            >
              Prioridade: {getPriorityText(selectedDemanda.prioridade)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seção de informações principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Tema</h3>
              {currentProblem ? (
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 py-3 bg-blue-50 hover:bg-blue-100"
                    onClick={() => setShowTemaDialog(true)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {renderIcon(currentProblem.icone)}
                    </div>
                    <span>{currentProblem.descricao}</span>
                  </Button>
                </div>
              ) : (
                <Select
                  value={selectedProblemId}
                  onValueChange={(value) => handleProblemChange(value)}
                  disabled={changingProblem}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemsLoading ? (
                      <SelectItem value="loading" disabled>Carregando temas...</SelectItem>
                    ) : problems.length > 0 ? (
                      problems.map((problem) => (
                        <SelectItem key={problem.id} value={problem.id}>
                          {problem.descricao}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>Nenhum tema encontrado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="servico" className="text-sm font-medium mb-2">Serviço</Label>
              <Select
                value={selectedServicoId}
                onValueChange={setSelectedServicoId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicosLoading ? (
                    <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>
                  ) : servicos.length > 0 ? (
                    servicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.descricao}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhum serviço encontrado</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          {/* Informações adicionais da demanda */}
          <div>
            <h3 className="text-base font-medium mb-3">Informações da Demanda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-gray-600">
                  <Info className="w-4 h-4 mr-1" />
                  <span className="text-xs">Origem</span>
                </div>
                <span className="text-sm font-medium">
                  {selectedDemanda.origens_demandas?.descricao || 'Não informado'}
                </span>
              </div>
              
              {selectedDemanda.protocolo && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-1" />
                    <span className="text-xs">Protocolo 156</span>
                  </div>
                  <span className="text-sm font-medium">{selectedDemanda.protocolo}</span>
                </div>
              )}
              
              {selectedDemanda.veiculo_imprensa && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Veículo de Imprensa</span>
                  </div>
                  <span className="text-sm font-medium">{selectedDemanda.veiculo_imprensa}</span>
                </div>
              )}
              
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-xs">Data de Criação</span>
                </div>
                <span className="text-sm font-medium">
                  {format(new Date(selectedDemanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">Prazo para Resposta</span>
                </div>
                <span className="text-sm font-medium">
                  {selectedDemanda.prazo_resposta ? formatDate(selectedDemanda.prazo_resposta) : 'Não definido'}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-gray-600">
                  <Flag className="w-4 h-4 mr-1" />
                  <span className="text-xs">Prioridade</span>
                </div>
                <span className={`text-sm font-medium ${
                  selectedDemanda.prioridade === 'alta' ? 'text-red-600' : 
                  selectedDemanda.prioridade === 'media' ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {getPriorityText(selectedDemanda.prioridade)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Localização */}
          {(selectedDemanda.endereco || selectedDemanda.bairro_id) && (
            <>
              <Separator />
              <div>
                <h3 className="text-base font-medium mb-3">Localização</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedDemanda.endereco && (
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-xs">Endereço</span>
                      </div>
                      <span className="text-sm font-medium">{selectedDemanda.endereco}</span>
                    </div>
                  )}
                  
                  {selectedDemanda.bairro_id && (
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-xs">Bairro</span>
                      </div>
                      <span className="text-sm font-medium">
                        {/* Aqui seria ideal ter o nome do bairro, mas vamos deixar o ID por enquanto */}
                        {selectedDemanda.bairro_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Detalhes da Solicitação</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              {selectedDemanda.detalhes_solicitacao || "Sem detalhes fornecidos"}
            </div>
          </div>
          
          {selectedDemanda.perguntas && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Perguntas e Respostas</h3>
              
              {Array.isArray(selectedDemanda.perguntas) ? (
                selectedDemanda.perguntas.map((pergunta: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-md text-blue-800">
                      <strong>Pergunta {index+1}:</strong> {pergunta}
                    </div>
                    <Textarea 
                      placeholder="Digite sua resposta"
                      className="min-h-[100px]"
                      value={resposta[index.toString()] || ''}
                      onChange={(e) => handleRespostaChange(index.toString(), e.target.value)}
                    />
                  </div>
                ))
              ) : (
                Object.entries(selectedDemanda.perguntas).map(([key, pergunta]) => (
                  <div key={key} className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-md text-blue-800">
                      <strong>Pergunta:</strong> {pergunta as string}
                    </div>
                    <Textarea 
                      placeholder="Digite sua resposta"
                      className="min-h-[100px]"
                      value={resposta[key] || ''}
                      onChange={(e) => handleRespostaChange(key, e.target.value)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
          
          <div>
            <Label htmlFor="comentarios" className="text-sm font-medium mb-2">Comentários (opcional)</Label>
            <Textarea 
              id="comentarios"
              placeholder="Adicione comentários internos sobre esta demanda"
              className="min-h-[100px]"
              value={setComentarios ? comentarios : localComentarios}
              onChange={(e) => {
                if (setComentarios) {
                  setComentarios(e.target.value);
                } else {
                  setLocalComentarios(e.target.value);
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
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
      
      {/* Dialog para seleção de tema */}
      <Dialog open={showTemaDialog} onOpenChange={setShowTemaDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Selecionar Tema</DialogTitle>
            <DialogDescription>
              Escolha um tema para esta demanda
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {problems.map((problem) => (
              <Button 
                key={problem.id} 
                variant={selectedProblemId === problem.id ? "default" : "outline"} 
                className={`flex flex-col items-center justify-center gap-2 p-3 h-auto ${
                  selectedProblemId === problem.id ? "ring-2 ring-[#003570]" : ""
                }`}
                onClick={() => handleProblemChange(problem.id)}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {renderIcon(problem.icone)}
                </div>
                <span className="text-sm text-center">{problem.descricao}</span>
              </Button>
            ))}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowTemaDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de alerta para mudança de coordenação */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Alteração de Coordenação
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está alterando o tema desta demanda para uma coordenação diferente.
              <br /><br />
              <strong>Coordenação original:</strong> {originalCoordination || 'Não definida'}
              <br />
              <strong>Nova coordenação:</strong> {newCoordination || 'Não definida'}
              <br /><br />
              Esta alteração fará com que a demanda deixe de ser visível para a coordenação original.
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateProblem(selectedProblemId)}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RespostaForm;
