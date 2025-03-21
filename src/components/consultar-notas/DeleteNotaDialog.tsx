
import React from 'react';
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
import { Trash } from 'lucide-react';

interface DeleteNotaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  notaTitle: string;
  hasDemanda: boolean;
}

const DeleteNotaDialog: React.FC<DeleteNotaDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  notaTitle,
  hasDemanda
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-red-600 flex items-center gap-2">
            <Trash className="h-5 w-5" /> Excluir nota
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            <p className="mb-4">
              Você tem certeza que deseja excluir a nota <strong>"{notaTitle}"</strong>?
            </p>
            
            {hasDemanda && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-yellow-800 mb-4">
                <strong>Atenção:</strong> Esta nota está vinculada a uma demanda. 
                Ao excluir esta nota, a demanda retornará para o status "Aguardando Nota".
              </div>
            )}
            
            <p>Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNotaDialog;
