
import React, { useState, useEffect } from 'react';
import { useUsersManagement } from './useUsersManagement';
import UsersLayout from './UsersLayout';
import { useUserActions } from './useUserActions';
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
    openDeleteDialog,
    isSubmitting: isDeleteSubmitting
  } = useUserDelete(fetchData);

  // Password reset functionality
  const {
    handleResetPassword
  } = usePasswordReset();

  // User approval functionality
  const {
    isApprovalDialogOpen,
    setIsApprovalDialogOpen,
    userToApprove,
    setUserToApprove,
    handleApproveUser,
    openApprovalDialog,
    roleName,
    setRoleName,
    approving
  } = useUserApproval(fetchData);

  // User access removal functionality
  const {
    handleRemoveAccess,
    removing
  } = useUserAccessRemoval(fetchData);

  // User roles management
  const {
    isRolesDialogOpen,
    userForRoles,
    loading: rolesLoading,
    openRolesDialog,
    closeRolesDialog
  } = useUserRolesManagement();

  // Combined user actions
  const userActions = {
    onEdit: openEditDialog,
    onDelete: openDeleteDialog,
    onResetPassword: handleResetPassword,
    onApprove: openApprovalDialog,
    onRemoveAccess: handleRemoveAccess,
    onManageRoles: openRolesDialog
  };

  // Load user data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <UsersLayout
        users={users}
        loading={loading || isLoading}
        filter={searchQuery}
        setFilter={setSearchQuery}
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={[]} // Coordenações serão buscadas em outro endpoint se necessário
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
        roleName={roleName}
        setRoleName={setRoleName}
        onApprove={handleApproveUser}
        isSubmitting={approving}
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
