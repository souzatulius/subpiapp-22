
import React from 'react';
import { useUsersManagement } from './users/useUsersManagement';
import UsersLayout from './users/UsersLayout';
import { useUserActions } from './users/useUserActions';
import { useUserEdit } from './users/hooks/useUserEdit';
import { useUserDelete } from './users/hooks/useUserDelete';
import { usePasswordReset } from './users/hooks/usePasswordReset';
import { useUserApproval } from './users/hooks/useUserApproval';
import { useUserAccessRemoval } from './users/hooks/useUserAccessRemoval';

const UsersManagement = () => {
  const {
    users,
    filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshUsers,
    areas,
    cargos,
    loading,
    fetchData
  } = useUsersManagement();

  // Initialize user management hooks
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser: selectedUser,
    setCurrentUser: setSelectedUser,
    handleEditUser,
    openEditDialog
  } = useUserEdit(fetchData);

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    deleteUser
  } = useUserDelete(fetchData);

  const { resetPassword } = usePasswordReset();
  const { approveUser, approving } = useUserApproval(fetchData);
  const { removeAccess, removing } = useUserAccessRemoval(fetchData);

  // Initialize userActions
  const userActions = useUserActions({
    setIsEditDialogOpen,
    setSelectedUser,
    setIsDeleteDialogOpen,
    setUserToDelete,
    resetPassword,
    approveUser,
    removeAccess
  });

  // Pass all necessary props to UsersLayout
  const usersManagementProps = {
    users: filteredUsers || users,
    loading: isLoading || loading,
    filter: searchQuery,
    setFilter: setSearchQuery,
    areas,
    cargos,
    isInviteDialogOpen: false, // This would be managed in a separate hook
    setIsInviteDialogOpen: () => {}, // Placeholder for now
    handleInviteUser: async () => {}, // Placeholder for now
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedUser,
    handleEditUser,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    handleDeleteUser,
    userActions,
    approving,
    removing
  };
  
  return (
    <div>
      <UsersLayout {...usersManagementProps} />
    </div>
  );
};

export default UsersManagement;
