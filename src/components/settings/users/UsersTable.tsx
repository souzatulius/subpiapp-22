
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  KeyRound, 
  UserCheck, 
  UserX
} from 'lucide-react';
import { User } from './types';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onApprove?: (user: User, roleName?: string) => void;
  onRemoveAccess?: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove,
  onRemoveAccess
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const hasPermissions = (user: User) => {
    return user.permissoes && user.permissoes.length > 0;
  };

  if (loading) {
    return <LoadingSkeleton rows={5} columns={6} />;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">Usuário</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Coordenação</TableHead>
            <TableHead>Supervisão Técnica</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      {user.foto_perfil_url ? (
                        <AvatarImage src={user.foto_perfil_url} alt={user.nome_completo} />
                      ) : null}
                      <AvatarFallback>{getInitials(user.nome_completo)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.nome_completo}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.cargos?.descricao || "-"}
                </TableCell>
                <TableCell>
                  {user.coordenacao?.descricao || "-"}
                </TableCell>
                <TableCell>
                  {user.supervisao_tecnica?.descricao || "-"}
                </TableCell>
                <TableCell>
                  {hasPermissions(user) ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Aguardando aprovação
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(user)}
                      title="Editar usuário"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onResetPassword && (
                          <DropdownMenuItem onClick={() => onResetPassword(user)}>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Resetar senha
                          </DropdownMenuItem>
                        )}
                        
                        {onApprove && !hasPermissions(user) && (
                          <DropdownMenuItem onClick={() => onApprove(user)}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Aprovar acesso
                          </DropdownMenuItem>
                        )}
                        
                        {onRemoveAccess && hasPermissions(user) && (
                          <DropdownMenuItem onClick={() => onRemoveAccess(user)}>
                            <UserX className="h-4 w-4 mr-2" />
                            Remover acesso
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => onDelete(user)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Excluir usuário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
