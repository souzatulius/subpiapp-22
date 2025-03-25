
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, KeyRound, UserCheck, UserX, Shield } from 'lucide-react';
import { User } from '@/types/common';

interface UserActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onApprove?: (user: User, roleName?: string) => void;
  onRemoveAccess?: (user: User) => void;
  onManageRoles?: (user: User) => void;
  isApproving?: boolean;
  isRemoving?: boolean;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove,
  onRemoveAccess,
  onManageRoles,
  isApproving,
  isRemoving
}) => {
  const hasPermissions = user.permissoes && user.permissoes.length > 0;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onResetPassword(user)}>
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Redefinir senha</span>
        </DropdownMenuItem>
        
        {hasPermissions && onManageRoles && (
          <DropdownMenuItem onClick={() => onManageRoles(user)}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Gerenciar permissões</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {!hasPermissions && onApprove && (
          <DropdownMenuItem onClick={() => onApprove(user)}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Aprovar acesso</span>
          </DropdownMenuItem>
        )}
        
        {hasPermissions && onRemoveAccess && (
          <DropdownMenuItem onClick={() => onRemoveAccess(user)}>
            <UserX className="mr-2 h-4 w-4" />
            <span>Remover acesso</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(user)}
          className="text-red-600 focus:text-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsMenu;
