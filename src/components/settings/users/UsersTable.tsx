
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
import { CircleUserRound, Loader2 } from 'lucide-react';
import UserActionsMenu from './UserActionsMenu';
import { User } from '@/types/common';
import { formatDate } from '@/types/common';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  filter: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onApprove?: (user: User, permissionLevel: string) => void;
  onRemoveAccess?: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  filter,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove,
  onRemoveAccess
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-subpi-blue" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CircleUserRound className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
        <p className="text-sm text-gray-500">
          {filter ? 'Tente usar outros termos de busca.' : 'Você ainda não tem usuários cadastrados.'}
        </p>
      </div>
    );
  }

  const hasNoPendingUserPermissions = (user: User) => {
    return !user.permissoes || user.permissoes.length === 0;
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Cargo</TableHead>
            <TableHead className="font-semibold">Coordenação</TableHead>
            <TableHead className="font-semibold">Supervisão Técnica</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {user.nome_completo}
              </TableCell>
              <TableCell>
                {user.email}
              </TableCell>
              <TableCell>
                {user.cargos?.descricao || 'Não definido'}
              </TableCell>
              <TableCell>
                {user.coordenacao?.descricao || 'Não definido'}
              </TableCell>
              <TableCell>
                {user.supervisao_tecnica?.descricao || 'Não definido'}
              </TableCell>
              <TableCell>
                {hasNoPendingUserPermissions(user) ? (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    Pendente
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Ativo
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {hasNoPendingUserPermissions(user) ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove && onApprove(user, 'admin')}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user)}
                    >
                      Excluir
                    </Button>
                  </div>
                ) : (
                  <UserActionsMenu
                    user={user}
                    onEdit={() => onEdit(user)}
                    onDelete={() => onDelete(user)}
                    onResetPassword={() => onResetPassword && onResetPassword(user)}
                    onApprove={onApprove}
                    onRemoveAccess={() => onRemoveAccess && onRemoveAccess(user)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
