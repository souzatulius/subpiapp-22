
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from './types';
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
          <DialogTitle className="text-xl font-semibold">
            Gerenciar Permissões - {user.nome_completo}
          </DialogTitle>
          <div className="text-sm text-gray-500 mt-2">
            <p>Cargo: {user.cargos?.descricao || '-'}</p>
            <p>Coordenação: {user.coordenacao?.descricao || '-'}</p>
            <p>Supervisão Técnica: {user.supervisao_tecnica?.descricao || '-'}</p>
          </div>
        </DialogHeader>
        
        <UserRolesManager userId={user.id} />
        
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="mt-4"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRolesDialog;
