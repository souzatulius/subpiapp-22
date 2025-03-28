
import { useState } from 'react';
import { useAccessControlData } from './useAccessControlData';
import { usePermissionsManagement } from './usePermissionsManagement';
import { User } from './types';

export const useAccessControl = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Fetch all data
  const {
    users,
    setUsers,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    error,
    fetchData
  } = useAccessControlData();

  // Permission management (add/remove)
  const {
    saving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(userPermissions, setUserPermissions, fetchData);

  // Function to open edit dialog
  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  // Function to update user info
  const handleUpdateUserInfo = async (userId: string, data: { whatsapp?: string; aniversario?: string }) => {
    try {
      console.log('Updating user info:', userId, data);
      // In a real implementation, this would save to the database
      // For now we'll just update the local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...data } : user
      ));
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating user info:', error);
      return Promise.reject(error);
    }
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
    handleRemovePermission,
    handleUpdateUserInfo
  };
};
