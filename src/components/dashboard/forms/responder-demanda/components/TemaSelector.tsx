
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { renderIcon } from '@/components/settings/problems/renderIcon';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, ThumbsUp } from 'lucide-react';

interface TemaSelectorProps {
  selectedProblemId: string;
  problems: any[];
  problemsLoading: boolean;
  demandaId: string;
  currentProblem?: any;
  onProblemChange: (problemId: string) => void;
}

const TemaSelector: React.FC<TemaSelectorProps> = ({
  selectedProblemId,
  problems,
  problemsLoading,
  demandaId,
  currentProblem,
  onProblemChange
}) => {
  const [showTemaDialog, setShowTemaDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [originalCoordination, setOriginalCoordination] = useState<string>('');
  const [newCoordination, setNewCoordination] = useState<string>('');
  const [changingProblem, setChangingProblem] = useState<boolean>(false);
  const [pendingProblemId, setPendingProblemId] = useState<string>('');

  const handleProblemChangeRequest = async (problemId: string) => {
    if (problemId === selectedProblemId) {
      return;
    }
    
    setPendingProblemId(problemId);
    
    const newProblem = problems.find(p => p.id === problemId);
    if (!newProblem || !newProblem.supervisao_tecnica) {
      return;
    }

    try {
      // First, fetch the original coordination for comparison
      const { data: originalProblemData } = await supabase
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
        .eq('id', selectedProblemId)
        .single();
        
      if (originalProblemData?.supervisoes_tecnicas?.coordenacoes) {
        setOriginalCoordination(originalProblemData.supervisoes_tecnicas.coordenacoes.descricao);
      }
      
      // Then fetch the new coordination
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
        .eq('id', demandaId);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Tema da demanda atualizado com sucesso",
      });
      
      onProblemChange(problemId);
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

  return (
    <>
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
          onValueChange={handleProblemChangeRequest}
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
                onClick={() => handleProblemChangeRequest(problem.id)}
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
            <AlertDialogAction onClick={() => updateProblem(pendingProblemId)}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TemaSelector;
