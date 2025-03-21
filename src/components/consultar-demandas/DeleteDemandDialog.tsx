
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface DeleteDemandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  demandId?: string;
}

const DeleteDemandDialog: React.FC<DeleteDemandDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  demandId
}) => {
  // Função para excluir a demanda e seus dados relacionados
  const handleDelete = async () => {
    if (!demandId) {
      toast({
        title: "Erro ao excluir",
        description: "ID da demanda não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Primeiro, excluímos as notas relacionadas à demanda
      console.log('Excluindo notas relacionadas à demanda:', demandId);
      const { error: notasError } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('demanda_id', demandId);
      
      if (notasError) {
        console.error('Erro ao excluir notas relacionadas:', notasError);
        toast({
          title: "Erro ao excluir notas relacionadas",
          description: notasError.message,
          variant: "destructive"
        });
        return;
      }
      
      // Excluir todas as possíveis referências na tabela respostas_demandas
      console.log('Excluindo respostas relacionadas à demanda:', demandId);
      
      // CORREÇÃO: Verificamos se existem respostas para garantir que não há mais referências
      const { data: respostasData, error: checkRespostasError } = await supabase
        .from('respostas_demandas')
        .select('id')
        .eq('demanda_id', demandId);
        
      if (checkRespostasError) {
        console.error('Erro ao verificar respostas existentes:', checkRespostasError);
        toast({
          title: "Erro ao verificar respostas relacionadas",
          description: checkRespostasError.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Respostas encontradas:', respostasData?.length);
      
      if (respostasData && respostasData.length > 0) {
        // Se existirem respostas, excluímos uma a uma para garantir
        for (const resposta of respostasData) {
          console.log('Excluindo resposta ID:', resposta.id);
          const { error: deleteRespostaError } = await supabase
            .from('respostas_demandas')
            .delete()
            .eq('id', resposta.id);
            
          if (deleteRespostaError) {
            console.error('Erro ao excluir resposta específica:', deleteRespostaError);
            toast({
              title: "Erro ao excluir resposta específica",
              description: deleteRespostaError.message,
              variant: "destructive"
            });
            return;
          }
        }
      }
      
      // Depois de excluir todos os dados relacionados, continuamos com a exclusão da demanda
      // A função onConfirm fará a exclusão da demanda
      await onConfirm();
      
    } catch (error: any) {
      console.error('Erro ao excluir demanda e dados relacionados:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a demanda e seus dados relacionados.",
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Demanda</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.
            Todas as notas oficiais e respostas relacionadas a esta demanda também serão excluídas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Excluindo...
              </>
            ) : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDemandDialog;
