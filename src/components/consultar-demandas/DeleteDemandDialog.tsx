
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
import { Loader2 } from "lucide-react";
import AttentionBox from "@/components/ui/attention-box";

export interface DeleteDemandDialogProps {
  isOpen: boolean;
  demandId: string;
  demandTitle?: string;
  hasNotes?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteDemandDialog: React.FC<DeleteDemandDialogProps> = ({
  isOpen,
  demandId,
  demandTitle = "esta demanda",
  hasNotes = false,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Demanda</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            <p className="mb-4">
              Tem certeza que deseja excluir a demanda <strong>"{demandTitle}"</strong>?
            </p>
            
            {hasNotes && (
              <AttentionBox title="Atenção:" className="mb-4">
                Esta demanda tem notas vinculadas a ela.
                Ao excluir esta demanda, todas as notas associadas também serão excluídas permanentemente.
              </AttentionBox>
            )}
            
            <p>Esta ação é permanente e não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
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

export default DeleteDemandDialog;
