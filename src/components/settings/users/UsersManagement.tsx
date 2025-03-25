
import React, { useState, useEffect } from 'react';
import { useUsersManagement } from './useUsersManagement';
import UsersLayout from './UsersLayout';
import { useUserEdit } from './hooks/useUserEdit';
import { useUserDelete } from './hooks/useUserDelete';
import { usePasswordReset } from './hooks/usePasswordReset';
import { useUserApproval } from './hooks/useUserApproval';
import { useUserAccessRemoval } from './hooks/useUserAccessRemoval';
import { useUserInvite } from './hooks/useUserInvite';
import { useUserRolesManagement } from './hooks/useUserRolesManagement';
import UserApprovalDialog from './UserApprovalDialog';
import UserRolesDialog from './UserRolesDialog';
import { User } from './types';

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
    supervisoesTecnicas,
    cargos,
    loading,
    fetchData
  } = useUsersManagement();

  // User edit dialog management
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    setCurrentUser,
    handleEditUser,
    openEditDialog,
    isSubmitting: isEditSubmitting
  } = useUserEdit(fetchData);

  // User invite dialog management
  const {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser,
    isSubmitting: isInviteSubmitting
  } = useUserInvite(fetchData);

  // User delete dialog management
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    deleteUser
  } = useUserDelete(fetchData);

  // Password reset functionality
  const {
    resetting,
    handleSendPasswordReset
  } = usePasswordReset();

  // User approval state
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);
  const [roleName, setRoleName] = useState('leitor');

  // User approval functionality
  const {
    approving,
    approveUser
  } = useUserApproval(fetchData);

  const handleApproveUser = (userId: string, userName: string, userEmail: string, role: string) => {
    approveUser(userId, userName, userEmail, role);
  };

  // User access removal functionality
  const {
    removing,
    removeAccess
  } = useUserAccessRemoval(fetchData);

  // User roles management
  const {
    isRolesDialogOpen,
    userForRoles,
    loading: rolesLoading,
    openRolesDialog,
    closeRolesDialog
  } = useUserRolesManagement();

  // Open approval dialog
  const openApprovalDialog = (user: User) => {
    setUserToApprove(user);
    setIsApprovalDialogOpen(true);
  };

  // Handle user actions
  const handleEdit = (user: User) => {
    openEditDialog(user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    handleSendPasswordReset(user);
  };

  const handleApprove = (user: User, roleName?: string) => {
    if (roleName) {
      approveUser(user.id, user.nome_completo, user.email, roleName);
    } else {
      openApprovalDialog(user);
    }
  };

  const handleRemoveAccess = (user: User) => {
    removeAccess(user);
  };

  const handleManageRoles = (user: User) => {
    openRolesDialog(user);
  };

  // Combined user actions
  const userActions = {
    handleEdit,
    handleDelete,
    handleResetPassword,
    handleApprove,
    handleRemoveAccess,
    handleManageRoles
  };

  // Load user data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <UsersLayout
        users={filteredUsers || users}
        loading={isLoading || loading}
        filter={searchQuery}
        setFilter={setSearchQuery}
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={[]} 
        isInviteDialogOpen={isInviteDialogOpen}
        setIsInviteDialogOpen={setIsInviteDialogOpen}
        handleInviteUser={handleInviteUser}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedUser={currentUser}
        handleEditUser={handleEditUser}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        handleDeleteUser={handleDeleteUser}
        userActions={userActions}
        approving={approving}
        removing={removing}
        isEditSubmitting={isEditSubmitting}
      />

      {/* Approval Dialog */}
      <UserApprovalDialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        user={userToApprove}
        onApprove={handleApproveUser}
        approving={approving}
      />

      {/* Roles Management Dialog */}
      <UserRolesDialog
        open={isRolesDialogOpen}
        onOpenChange={closeRolesDialog}
        user={userForRoles}
      />
    </>
  );
};

export default UsersManagement;
