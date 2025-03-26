
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  KeyRound, 
  UserCheck, 
  UserX
} from 'lucide-react';
import { User } from './types';

interface UserActionsMenuProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onApprove?: (user: User) => void;
  onRemoveAccess?: (user: User) => void;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove,
  onRemoveAccess,
}) => {
  // Check if user is active (has permissions)
  const isActive = user.permissoes && user.permissoes.length > 0;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        )}
        
        {onResetPassword && (
          <DropdownMenuItem onClick={() => onResetPassword(user)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Redefinir senha
          </DropdownMenuItem>
        )}
        
        {!isActive && onApprove && (
          <DropdownMenuItem onClick={() => onApprove(user)}>
            <UserCheck className="mr-2 h-4 w-4" />
            Aprovar acesso
          </DropdownMenuItem>
        )}
        
        {isActive && onRemoveAccess && (
          <DropdownMenuItem onClick={() => onRemoveAccess(user)}>
            <UserX className="mr-2 h-4 w-4" />
            Remover acesso
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(user)}
              className="text-red-600 hover:text-red-700 focus:text-red-700"
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsMenu;
