
import React, { useState, useEffect } from 'react';
import { useUsersManagement } from './users/useUsersManagement';
import UsersLayout from './users/UsersLayout';
import { useUserActions } from './users/useUserActions';
import { useUserEdit } from './users/hooks/useUserEdit';
import { useUserDelete } from './users/hooks/useUserDelete';
import { usePasswordReset } from './users/hooks/usePasswordReset';
import { useUserApproval } from './users/hooks/useUserApproval';
import { useUserAccessRemoval } from './users/hooks/useUserAccessRemoval';
import { useUserInvite } from './users/hooks/useUserInvite';
import UserApprovalDialog from './users/UserApprovalDialog';
import { supabase } from '@/integrations/supabase/client';
import { User } from './users/types';

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

  const [coordenacoes, setCoordenacoes] = useState<{id: string, descricao: string}[]>([]);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);

  useEffect(() => {
    const fetchCoordenacoes = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');
          
        if (error) {
          console.error('Error fetching coordenações:', error);
          return;
        }
        
        console.log('Fetched coordenações:', data);
        setCoordenacoes(data || []);
      } catch (error) {
        console.error('Error in fetchCoordenacoes:', error);
      }
    };
    
    fetchCoordenacoes();
  }, []);

  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser: selectedUser,
    setCurrentUser: setSelectedUser,
    handleEditUser,
    openEditDialog,
    isSubmitting: isEditSubmitting
  } = useUserEdit(fetchData);

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    deleteUser
  } = useUserDelete(fetchData);

  const {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser
  } = useUserInvite(fetchData);

  const resetPassword = usePasswordReset();
  const { approveUser, approving } = useUserApproval(fetchData);
  const { removeAccess, removing } = useUserAccessRemoval(fetchData);

  const openApprovalDialog = (user: User) => {
    console.log('Opening approval dialog for user:', user);
    setUserToApprove(user);
    setIsApprovalDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    openEditDialog(user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Modified to use openApprovalDialog instead of direct approving
  const handleApprove = (user: User) => {
    openApprovalDialog(user);
  };

  const handleRemoveAccess = (user: User) => {
    removeAccess(user);
  };

  const handleResetPassword = (user: User) => {
    resetPassword.handleSendPasswordReset(user);
  };
  
  const handleRefreshData = () => {
    fetchData();
  };

  const userActions = useUserActions({
    setIsEditDialogOpen,
    setSelectedUser: handleEdit,
    setIsDeleteDialogOpen,
    setUserToDelete: handleDelete,
    resetPassword: handleResetPassword,
    approveUser: handleApprove, // Make sure this uses the handleApprove function
    removeAccess: handleRemoveAccess
  });

  const usersManagementProps = {
    users: filteredUsers || users,
    loading: isLoading || loading,
    filter: searchQuery,
    setFilter: setSearchQuery,
    supervisoesTecnicas,
    cargos,
    coordenacoes,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser,
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
    removing,
    isEditSubmitting,
    onRefresh: handleRefreshData,
    statusFilter,
    setStatusFilter
  };
  
  return (
    <div>
      <UsersLayout {...usersManagementProps} />
      
      <UserApprovalDialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        user={userToApprove}
        onApprove={approveUser}
        approving={approving}
      />
    </div>
  );
};

export default UsersManagement;
