
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteAnnouncementDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  announcement: any;
  onDelete: () => Promise<void>;
}

const DeleteAnnouncementDialog: React.FC<DeleteAnnouncementDialogProps> = ({
  open,
  setOpen,
  announcement,
  onDelete,
}) => {
  if (!announcement) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Comunicado</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-gray-50 rounded-md">
          <p><strong>Título:</strong> {announcement.titulo}</p>
          <p><strong>Para:</strong> {announcement.destinatarios}</p>
          <p><strong>Data:</strong> {format(new Date(announcement.data_envio), 'dd/MM/yyyy HH:mm', { locale: pt })}</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAnnouncementDialog;
