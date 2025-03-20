
import { useAccessControlData } from './useAccessControlData';
import { usePermissionsManagement } from './usePermissionsManagement';
import { useAccessControlUserInfo } from './hooks/useAccessControlUserInfo';
import { useAccessControlFilter } from './hooks/useAccessControlFilter';
import { useAccessControlExport } from './hooks/useAccessControlExport';
import { useCurrentUser } from './hooks/useCurrentUser';

export const useAccessControl = () => {
  // Fetch data including users, permissions, and user permissions
  const {
    users,
    setUsers,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    error,
    fetchData,
  } = useAccessControlData();

  // Current user information
  const { currentUserId } = useCurrentUser();

  // Permission management (add/remove)
  const {
    saving: permissionSaving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(userPermissions, setUserPermissions, fetchData);

  // User information management (edit dialog, update)
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    saving: userInfoSaving,
    openEditDialog,
    handleUpdateUserInfo
  } = useAccessControlUserInfo(users, setUsers, fetchData);

  // User filtering
  const { filter, setFilter, filteredUsers } = useAccessControlFilter(users);

  // Export and print functionality
  const { handleExportCsv, handlePrint } = useAccessControlExport(
    users,
    permissions,
    userPermissions
  );

  // Combined saving state from both hooks
  const saving = permissionSaving || userInfoSaving;

  return {
    permissions,
    userPermissions,
    loading,
    error,
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
