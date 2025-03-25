
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

  // Fetch coordenacoes
  useEffect(() => {
    const fetchCoordenacoes = async () => {
      try {
        // Fetch coordenações from the new table
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

  // Initialize user management hooks
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

  const { handleSendPasswordReset: resetPassword } = usePasswordReset();
  const { approveUser, approving } = useUserApproval(fetchData);
  const { removeAccess, removing } = useUserAccessRemoval(fetchData);

  // Handle approval dialog
  const openApprovalDialog = (user: User) => {
    setUserToApprove(user);
    setIsApprovalDialogOpen(true);
  };
  
  // Handle roles dialog
  const openRolesDialog = (user: User) => {
    setUserToManageRoles(user);
    setIsRolesDialogOpen(true);
  };

  // Wrapper functions to handle type compatibility
  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleApprove = (user: User, roleName?: string) => {
    if (roleName) {
      approveUser(user.id, user.nome_completo, user.email, roleName);
    } else {
      openApprovalDialog(user);
    }
  };

  // Initialize userActions
  const userActions = useUserActions({
    setIsEditDialogOpen,
    setSelectedUser: handleEdit,
    setIsDeleteDialogOpen,
    setUserToDelete: handleDelete,
    resetPassword,
    approveUser: handleApprove,
    removeAccess
  });

  // Pass all necessary props to UsersLayout
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
    isEditSubmitting
  };
  
  return (
    <div>
      <UsersLayout {...usersManagementProps} />
      
      {/* User Approval Dialog */}
      <UserApprovalDialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        user={userToApprove}
        onApprove={approveUser}
        approving={approving}
      />
      
      {/* User Roles Dialog */}
      <UserRolesDialog
        open={isRolesDialogOpen}
        onOpenChange={setIsRolesDialogOpen}
        user={userToManageRoles}
      />
    </div>
  );
};

export default UsersManagement;
