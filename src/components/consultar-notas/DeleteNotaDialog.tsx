
import React, { useState } from 'react';
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
import { NotaOficial } from '@/types/nota';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export interface DeleteNotaDialogProps {
  nota: NotaOficial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteNotaDialog: React.FC<DeleteNotaDialogProps> = ({ 
  nota, 
  open, 
  onOpenChange 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!nota || isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ status: 'excluida' })
        .eq('id', nota.id);

      if (error) throw error;

      // If this nota has a demanda_id, update the demanda status
      if (nota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'aguardando_nota' })
          .eq('id', nota.demanda_id);

        if (demandaError) {
          console.error("Error updating related demand:", demandaError);
          // Don't throw - continue with success message for nota deletion
        }
      }

      // Success!
      toast({
        title: "Nota excluída",
        description: "A nota foi excluída com sucesso."
      });
      
      onOpenChange(false);
      
      // Force refresh the data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error deleting nota:', error);
      toast({
        title: "Erro ao excluir nota",
        description: error.message || "Ocorreu um erro ao excluir a nota.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir nota</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a nota "<span className="font-medium">{nota.titulo}</span>"?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNotaDialog;
