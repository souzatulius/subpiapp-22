
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
      console.error('Erro ao ocultar demanda:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Ocultar Demanda</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">Tem certeza que deseja ocultar esta demanda? Ela não aparecerá mais nas listagens.</p>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-2">
              <p className="text-yellow-800 font-medium">Observação:</p>
              <p className="text-yellow-800">Notas oficiais e respostas relacionadas serão mantidas no sistema. 
              Este processo é reversível apenas por administradores do sistema.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Ocultando...
              </>
            ) : 'Ocultar Demanda'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDemandDialog;
