
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import UserPermissionRow from './UserPermissionRow';

export interface AccessControlTableProps {
  filteredUsers: any[];
  permissions: any[];
  userPermissions: Record<string, string[]>;
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
  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">
          {filter ? 'Nenhum usuário encontrado para a busca' : 'Nenhum usuário cadastrado'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                Usuário
              </th>
              {permissions.map((permission) => (
                <th key={permission.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {permission.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <UserPermissionRow
                key={user.id}
                user={user}
                permissions={permissions}
                userPermissions={userPermissions[user.id] || []}
                saving={saving}
                handleAddPermission={handleAddPermission}
                handleRemovePermission={handleRemovePermission}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessControlTable;
