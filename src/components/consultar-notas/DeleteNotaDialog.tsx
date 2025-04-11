
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AttentionBox from '@/components/ui/attention-box';
import { Loader2 } from 'lucide-react';

interface DeleteNotaDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  notaTitle?: string;
  hasDemanda?: boolean;
  isLoading?: boolean;
}

const DeleteNotaDialog: React.FC<DeleteNotaDialogProps> = ({
  isOpen,
  onClose = () => {},
  onConfirm,
  onCancel = () => {},
  notaTitle = "esta nota",
  hasDemanda = false,
  isLoading = false
}) => {
  const handleClose = () => {
    if (!isLoading) {
      if (onClose) onClose();
      if (onCancel) onCancel();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Nota</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            <p className="mb-4">
              Você tem certeza que deseja excluir a nota <strong>"{notaTitle}"</strong>?
            </p>
            
            {hasDemanda && (
              <AttentionBox title="Atenção:" className="mb-4">
                Esta nota está vinculada a uma demanda. 
                Ao excluir esta nota, a demanda retornará para o status de "Aguardando Nota".
              </AttentionBox>
            )}
            
            <p>Esta ação é permanente e não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNotaDialog;
