import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Send, AlertTriangle, ThumbsUp } from 'lucide-react';
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
import { useProblemsData } from '@/hooks/problems';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface RespostaFormProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  onBack,
  isLoading,
  onSubmit
}) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [originalCoordination, setOriginalCoordination] = useState<string | null>(null);
  const [newCoordination, setNewCoordination] = useState<string | null>(null);
  const [changingProblem, setChangingProblem] = useState(false);
  
  const { problems, isLoading: problemsLoading } = useProblemsData();

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
  }, [selectedDemanda, setResposta]);
  
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
  
  const allQuestionsAnswered = () => {
    if (!selectedDemanda?.perguntas) return false;
    
    const questions = Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas 
      : Object.values(selectedDemanda.perguntas);
      
    const answers = Object.values(resposta);
    
    if (questions.length !== answers.length) return false;
    
    return answers.every(answer => !!answer.trim());
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
              className={
                selectedDemanda.prioridade === 'alta' 
                  ? 'bg-red-100 text-red-800 border-red-200' 
                  : selectedDemanda.prioridade === 'media'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-green-100 text-green-800 border-green-200'
              }
            >
              Prioridade: {selectedDemanda.prioridade === 'alta' ? 'Alta' : selectedDemanda.prioridade === 'media' ? 'Média' : 'Baixa'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Tema</h3>
            <Select
              value={selectedProblemId}
              onValueChange={handleProblemChange}
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
                      {problem.supervisao_tecnica?.coordenacao && ` (${problem.supervisao_tecnica.coordenacao})`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Nenhum tema encontrado</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

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
        </CardContent>
        <CardFooter className="justify-end">
          <Button 
            onClick={onSubmit}
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
