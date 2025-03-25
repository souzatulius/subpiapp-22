
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/common';
import UserRolesManager from './UserRolesManager';

interface UserRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const UserRolesDialog: React.FC<UserRolesDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões - {user.nome_completo}</DialogTitle>
        </DialogHeader>
        
        <UserRolesManager userId={user.id} />
        
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRolesDialog;
