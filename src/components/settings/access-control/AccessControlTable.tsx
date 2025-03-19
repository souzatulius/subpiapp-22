
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import UserPermissionRow from './UserPermissionRow';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export interface AccessControlTableProps {
  filteredUsers: any[];
  permissions: any[];
  userPermissions: Record<string, string[]>;
  loading: boolean;
  saving: boolean;
  filter: string;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
  openEditDialog: (user: any) => void;
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
  openEditDialog,
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              {permissions.map((permission) => (
                <th key={permission.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {permission.descricao} (Nível: {permission.nivel_acesso})
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{user.nome_completo}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p>WhatsApp: {user.whatsapp || '-'}</p>
                    <p>Aniversário: {user.aniversario ? format(new Date(user.aniversario), 'dd/MM/yyyy', { locale: pt }) : '-'}</p>
                  </div>
                </td>
                
                {permissions.map((permission) => (
                  <td key={permission.id} className="px-4 py-3 text-center">
                    <UserPermissionRow
                      user={user}
                      permission={permission}
                      userPermissions={userPermissions[user.id] || []}
                      saving={saving}
                      handleAddPermission={handleAddPermission}
                      handleRemovePermission={handleRemovePermission}
                    />
                  </td>
                ))}
                
                <td className="px-4 py-3 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(user)}
                    className="inline-flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessControlTable;
