
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export interface UserPermissionRowProps {
  user: any;
  permissions: any[];
  userPermissions: string[];
  saving: boolean;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
}

const UserPermissionRow: React.FC<UserPermissionRowProps> = ({
  user,
  permissions,
  userPermissions,
  saving,
  handleAddPermission,
  handleRemovePermission,
}) => {
  return (
    <tr key={user.id}>
      <td className="px-4 py-3 text-sm">
        <div>
          <p className="font-medium">{user.nome_completo}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </td>
      
      {permissions.map((permission) => (
        <td key={permission.id} className="px-4 py-3 text-center">
          <Checkbox
            checked={userPermissions.includes(permission.id)}
            disabled={saving}
            onCheckedChange={(checked) => {
              if (checked) {
                handleAddPermission(user.id, permission.id);
              } else {
                handleRemovePermission(user.id, permission.id);
              }
            }}
          />
        </td>
      ))}
    </tr>
  );
};

export default UserPermissionRow;
