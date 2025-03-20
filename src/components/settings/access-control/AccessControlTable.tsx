
import React from 'react';
import UserRow from './UserRow';
import TableHeader from './TableHeader';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import { User, Permission } from './types';

export interface AccessControlTableProps {
  filteredUsers: User[];
  permissions: Permission[];
  userPermissions: Record<string, string[]>;
  loading: boolean;
  saving: boolean;
  filter: string;
  currentUserId: string | null;
  handleAddPermission: (userId: string, permissionId: string) => Promise<void>;
  handleRemovePermission: (userId: string, permissionId: string) => Promise<void>;
  openEditDialog: (user: User) => void;
}

const AccessControlTable: React.FC<AccessControlTableProps> = ({
  filteredUsers,
  permissions,
  userPermissions,
  loading,
  saving,
  filter,
  currentUserId,
  handleAddPermission,
  handleRemovePermission,
  openEditDialog,
}) => {
  // Adicionar log para depuração
  console.log('AccessControlTable props:', { 
    userCount: filteredUsers.length,
    permissionCount: permissions.length,
    userPermissionsCount: Object.keys(userPermissions).length,
    currentUserId
  });

  if (loading) {
    return (
      <div className="rounded-md border">
        <LoadingSkeleton />
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader permissions={permissions} />
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                permissions={permissions}
                userPermissions={userPermissions[user.id] || []}
                saving={saving}
                currentUserId={currentUserId}
                handleAddPermission={handleAddPermission}
                handleRemovePermission={handleRemovePermission}
                openEditDialog={openEditDialog}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessControlTable;
