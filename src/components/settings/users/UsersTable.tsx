
import React from 'react';
import { User } from './types';
import { formatDate } from '@/types/common';
import UserActionsMenu from './UserActionsMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  filter: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onApprove?: (user: User, roleName?: string) => void;
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
  // Filter users based on the search query
  const filteredUsers = users.filter(user => {
    if (!filter) return true;
    
    const searchTerm = filter.toLowerCase();
    return (
      user.nome_completo?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.cargos?.descricao?.toLowerCase().includes(searchTerm) ||
      user.coordenacao?.descricao?.toLowerCase().includes(searchTerm) ||
      user.supervisao_tecnica?.descricao?.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="w-full text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Carregando usuários...</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500">
          {filter ? 'Nenhum usuário encontrado para a pesquisa.' : 'Nenhum usuário cadastrado.'}
        </p>
      </div>
    );
  }

  // Function to get initials from name
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to get status badge color and text
  const getStatusBadge = (user: User) => {
    const status = user.status || (hasPermissions(user) ? 'ativo' : 'pendente');
    
    switch (status) {
      case 'aguardando_email':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aguardando Email</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case 'ativo':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
      case 'excluido':
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Excluído</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100">Desconhecido</Badge>;
    }
  };

  // Function to check if user has permissions
  const hasPermissions = (user: User) => {
    return user.permissoes && user.permissoes.length > 0;
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Usuário</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Cargo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Coordenação</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      {user.foto_perfil_url ? (
                        <AvatarImage src={user.foto_perfil_url} alt={user.nome_completo} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(user.nome_completo)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.nome_completo}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {user.cargos?.descricao || '-'}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {user.coordenacao?.descricao || '-'}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(user)}
                </td>
                <td className="px-4 py-3 text-right">
                  <UserActionsMenu
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onResetPassword={onResetPassword}
                    onApprove={onApprove}
                    onRemoveAccess={onRemoveAccess}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
