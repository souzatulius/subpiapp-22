
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
  const handleDelete = async () => {
    if (!demandId) {
      console.error('ID da demanda não encontrado');
      return;
    }
    
    try {
      await onConfirm();
    } catch (error) {
      console.error('Erro ao excluir demanda e dados relacionados:', error);
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
