
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AttentionBox from '@/components/ui/attention-box';

interface DeleteNotaDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  notaTitle?: string;
  hasDemanda?: boolean;
}

const DeleteNotaDialog: React.FC<DeleteNotaDialogProps> = ({
  isOpen,
  onClose = () => {},
  onConfirm,
  onCancel,
  notaTitle = "esta nota",
  hasDemanda = false
}) => {
  const handleClose = () => {
    if (onClose) onClose();
    if (onCancel) onCancel();
  };

  return <AlertDialog open={isOpen} onOpenChange={handleClose}>
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
                Ao excluir esta nota, a demanda retornará para o status de "Pendente".
              </AttentionBox>
            )}
            
            <p>Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};

export default DeleteNotaDialog;
