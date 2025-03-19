
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UserPermissionRow from './UserPermissionRow';

interface AccessControlTableProps {
  users: any[];
  permissions: any[];
  userPermissions: Record<string, string[]>;
  filteredUsers: any[];
  loading: boolean;
  saving: boolean;
  filter: string;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
}

const AccessControlTable: React.FC<AccessControlTableProps> = ({
  filteredUsers,
  permissions,
  userPermissions,
  loading,
  saving,
  filter,
  handleAddPermission,
  handleRemovePermission,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Permissões</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]" />
                <p className="mt-2">Carregando dados...</p>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                {filter ? 'Nenhum usuário encontrado para a busca' : 'Nenhum usuário cadastrado'}
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => {
              const userPerms = userPermissions[user.id] || [];
              
              return (
                <UserPermissionRow
                  key={user.id}
                  user={user}
                  userPerms={userPerms}
                  permissions={permissions}
                  saving={saving}
                  handleAddPermission={handleAddPermission}
                  handleRemovePermission={handleRemovePermission}
                />
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccessControlTable;
