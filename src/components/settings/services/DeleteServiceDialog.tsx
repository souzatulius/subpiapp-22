
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
} from "@/components/ui/alert-dialog";

interface DeleteServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  serviceName: string;
  isDeleting?: boolean;
}

const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  serviceName,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o serviço "{serviceName}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServiceDialog;
