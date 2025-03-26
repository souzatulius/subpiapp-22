
import React, { useState, useEffect } from 'react';
import { useUsersManagement } from './useUsersManagement';
import UsersLayout from './UsersLayout';
import { useUserEdit } from './hooks/useUserEdit';
import { useUserDelete } from './hooks/useUserDelete';
import { usePasswordReset } from './hooks/usePasswordReset';
import { useUserApproval } from './hooks/useUserApproval';
import { useUserAccessRemoval } from './hooks/useUserAccessRemoval';
import { useUserInvite } from './hooks/useUserInvite';
import UserApprovalDialog from './UserApprovalDialog';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { useUserActions } from './useUserActions';

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
    approveUser: handleApprove,
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
    onRefresh: handleRefreshData
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
