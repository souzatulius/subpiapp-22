
import { useState, useEffect } from 'react';
import { User } from './types';
import { useAccessControlData } from './useAccessControlData';
import { usePermissionsManagement } from './usePermissionsManagement';
import { useUserInfo } from './useUserInfo';
import { filterUsers, exportToCsv, printAccessControl } from './accessControlUtils';
import { supabase } from '@/integrations/supabase/client';

export const useAccessControl = () => {
  const [filter, setFilter] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
        console.log('Current user ID:', data.user.id);
      }
    };
    fetchCurrentUser();
  }, []);
  
  const {
    users,
    setUsers,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    fetchData,
  } = useAccessControlData();

  const {
    saving: permissionSaving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(userPermissions, setUserPermissions, fetchData);

  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    saving: userInfoSaving,
    openEditDialog,
    handleUpdateUserInfo
  } = useUserInfo(users, setUsers);

  // Combined saving state from both hooks
  const saving = permissionSaving || userInfoSaving;

  // Filter users based on search term
  const filteredUsers = filterUsers(users, filter);

  // Export to CSV
  const handleExportCsv = () => {
    exportToCsv(users, permissions, userPermissions);
  };

  // Print
  const handlePrint = () => {
    printAccessControl();
  };

  return {
    permissions,
    userPermissions,
    loading,
    saving,
    filter,
    setFilter,
    filteredUsers,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    currentUserId,
    openEditDialog,
    handleAddPermission,
    handleRemovePermission,
    handleUpdateUserInfo,
    handleExportCsv,
    handlePrint,
    fetchData,
  };
};
