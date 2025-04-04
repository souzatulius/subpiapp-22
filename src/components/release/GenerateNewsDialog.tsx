
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

interface GenerateNewsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
  onGenerateNews: () => void;
}

const GenerateNewsDialog: React.FC<GenerateNewsDialogProps> = ({
  open,
  setOpen,
  onCancel,
  onGenerateNews
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gerar notícia?</AlertDialogTitle>
          <AlertDialogDescription>
            Release salvo com sucesso! Deseja gerar uma notícia a partir deste release agora?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Não
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onGenerateNews}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            Sim, gerar notícia
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GenerateNewsDialog;
