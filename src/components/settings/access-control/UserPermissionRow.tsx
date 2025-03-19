
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export interface UserPermissionRowProps {
  user: any;
  permission: any;
  userPermissions: string[];
  saving: boolean;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
}

const UserPermissionRow: React.FC<UserPermissionRowProps> = ({
  user,
  permission,
  userPermissions,
  saving,
  handleAddPermission,
  handleRemovePermission,
}) => {
  return (
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
  );
};

export default UserPermissionRow;
