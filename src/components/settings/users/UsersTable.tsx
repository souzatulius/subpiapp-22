import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import UserActionsMenu from './UserActionsMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UsersTableProps } from '@/types/users';
import { formatDate } from '@/types/common';

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  filter,
  onEdit,
  onDelete,
  onResetPassword,
  onApprove,
  onRemoveAccess,
  onManageRoles
}) => {
  // Status badge color mapping
  const getStatusBadge = (hasPermissions: boolean) => {
    if (hasPermissions) {
      return <Badge className="bg-green-500">Ativo</Badge>;
    }
    return <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>;
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return '??';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Get summary of user roles
  const getUserRolesSummary = (permissoes: any[] | undefined) => {
    if (!permissoes || permissoes.length === 0) {
      return 'Sem permissões';
    }
    
    // If there are many roles, summarize
    if (permissoes.length > 2) {
      return `${permissoes[0]?.descricao}, ${permissoes[1]?.descricao} + ${permissoes.length - 2}`;
    }
    
    // Otherwise list them
    return permissoes.map(p => p?.descricao).join(', ');
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        {filter ? 'Nenhum usuário corresponde à busca.' : 'Nenhum usuário cadastrado.'}
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="p-3 text-left font-medium text-sm text-muted-foreground">Usuário</th>
            <th className="p-3 text-left font-medium text-sm text-muted-foreground">Cargo</th>
            <th className="p-3 text-left font-medium text-sm text-muted-foreground">Área</th>
            <th className="p-3 text-left font-medium text-sm text-muted-foreground">Permissões</th>
            <th className="p-3 text-left font-medium text-sm text-muted-foreground">Status</th>
            <th className="p-3 text-left font-medium text-sm text-muted-foreground">Cadastro</th>
            <th className="p-3 text-center font-medium text-sm text-muted-foreground">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-muted/30">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.foto_perfil_url || ''} alt={user.nome_completo} />
                    <AvatarFallback>{getUserInitials(user.nome_completo)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.nome_completo}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 text-sm">{user.cargos?.descricao || '-'}</td>
              <td className="p-3 text-sm">
                {user.supervisao_tecnica?.descricao || user.coordenacao?.descricao || '-'}
              </td>
              <td className="p-3 text-sm">
                {getUserRolesSummary(user.permissoes)}
              </td>
              <td className="p-3">
                {getStatusBadge(user.permissoes && user.permissoes.length > 0)}
              </td>
              <td className="p-3 text-sm">
                {formatDate(user.criado_em)}
              </td>
              <td className="p-3">
                <div className="flex justify-center">
                  <UserActionsMenu
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onResetPassword={onResetPassword}
                    onApprove={onApprove}
                    onRemoveAccess={onRemoveAccess}
                    onManageRoles={onManageRoles}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
