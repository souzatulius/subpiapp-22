
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
import UserRolesDialog from './users/UserRolesDialog';
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
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [userToManageRoles, setUserToManageRoles] = useState<User | null>(null);

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
  
  const openRolesDialog = (user: User) => {
    console.log('Opening roles dialog for user:', user);
    setUserToManageRoles(user);
    setIsRolesDialogOpen(true);
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
    removeAccess: handleRemoveAccess,
    manageRoles: openRolesDialog
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
    userActions: {
      ...userActions,
      handleManageRoles: openRolesDialog
    },
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
      
      <UserRolesDialog
        open={isRolesDialogOpen}
        onOpenChange={setIsRolesDialogOpen}
        user={userToManageRoles}
      />
    </div>
  );
};

export default UsersManagement;
