
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
  // Função para excluir a demanda e a nota relacionada
  const handleDelete = async () => {
    if (!demandId) return;
    
    try {
      // Primeiro, excluímos as notas relacionadas à demanda
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
      
      // Depois de excluir as notas, continuamos com a exclusão da demanda via onConfirm
      await onConfirm();
      
    } catch (error) {
      console.error('Erro ao excluir demanda e notas:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a demanda e suas notas relacionadas.",
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
            Todas as notas oficiais relacionadas a esta demanda também serão excluídas.
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
