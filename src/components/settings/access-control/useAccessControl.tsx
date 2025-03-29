import { useState } from 'react';
import { useAccessControlData } from './useAccessControlData';
import { usePermissionsManagement } from './usePermissionsManagement';
import { User } from './types';

export const useAccessControl = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const {
    users,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    error,
    fetchData
  } = useAccessControlData();

  const {
    saving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(userPermissions, setUserPermissions, fetchData);

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  return {
    users,
    permissions,
    userPermissions,
    loading,
    error,
    saving,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    openEditDialog,
    handleAddPermission,
    handleRemovePermission
  };
};
