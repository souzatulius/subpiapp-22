
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserPermissionRowProps {
  user: {
    id: string;
    nome_completo: string;
    email: string;
  };
  userPerms: string[];
  permissions: {
    id: string;
    descricao: string;
    nivel_acesso?: number;
  }[];
  saving: boolean;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
}

const UserPermissionRow: React.FC<UserPermissionRowProps> = ({
  user,
  userPerms,
  permissions,
  saving,
  handleAddPermission,
  handleRemovePermission,
}) => {
  const availablePermissions = permissions.filter(p => !userPerms.includes(p.id));
  
  return (
    <TableRow key={user.id}>
      <TableCell>
        <div className="font-medium">{user.nome_completo}</div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {userPerms.length === 0 ? (
            <span className="text-gray-500">Nenhuma permissão atribuída</span>
          ) : (
            userPerms.map(permissionId => {
              const permission = permissions.find(p => p.id === permissionId);
              
              return permission ? (
                <div key={permissionId} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-xs">
                  <span>{permission.descricao}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemovePermission(user.id, permissionId)}
                    disabled={saving}
                  >
                    ×
                  </Button>
                </div>
              ) : null;
            })
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => handleAddPermission(user.id, value)}
            disabled={saving || availablePermissions.length === 0}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Adicionar permissão" />
            </SelectTrigger>
            <SelectContent>
              {availablePermissions.map((permission) => (
                <SelectItem key={permission.id} value={permission.id}>
                  {permission.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserPermissionRow;
