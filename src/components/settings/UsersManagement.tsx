
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
import { supabase } from '@/integrations/supabase/client';

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

  const [coordenacoes, setCoordenacoes] = useState<{coordenacao_id: string, coordenacao: string}[]>([]);

  // Fetch coordenações
  useEffect(() => {
    const fetchCoordenacoes = async () => {
      try {
        const { data, error } = await supabase.rpc('get_unique_coordenacoes');
        
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

  const {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser
  } = useUserInvite(fetchData);

  const { handleSendPasswordReset: resetPassword } = usePasswordReset();
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
    removing
  };
  
  return (
    <div>
      <UsersLayout {...usersManagementProps} />
    </div>
  );
};

export default UsersManagement;
