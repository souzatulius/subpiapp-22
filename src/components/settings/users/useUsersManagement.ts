
import { useUsersData } from './useUsersData';
import { useUsersFilter } from './useUsersFilter';
import { useUserInvite } from './hooks/useUserInvite';
import { useUserEdit } from './hooks/useUserEdit';
import { useUserDelete } from './hooks/useUserDelete';
import { usePasswordReset } from './hooks/usePasswordReset';
import { useUserActions } from './useUserActions';
import { useUserApproval } from './hooks/useUserApproval';
import { useUserAccessRemoval } from './hooks/useUserAccessRemoval';
import { User } from './types';

export const useUsersManagement = () => {
  // Fetch users data
  const { users, areas, cargos, loading, fetchData } = useUsersData();
  
  // Filter users
  const { filter, setFilter, filteredUsers } = useUsersFilter(users);
  
  // User invite functionality
  const { isInviteDialogOpen, setIsInviteDialogOpen, handleInviteUser } = useUserInvite(fetchData);
  
  // User edit functionality  
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentUser: selectedUser, 
    setCurrentUser: setSelectedUser,
    handleEditUser,
    openEditDialog
  } = useUserEdit(fetchData);
  
  // User delete functionality
  const { 
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser: userToDelete,
    setCurrentUser: setUserToDelete,
    handleDeleteUser,
    openDeleteDialog
  } = useUserDelete(fetchData);
  
  // Password reset functionality
  const { handleSendPasswordReset: resetPassword } = usePasswordReset();
  
  // User approval functionality
  const { approving, approveUser } = useUserApproval(fetchData);
  
  // User access removal functionality
  const { removing, removeUserAccess } = useUserAccessRemoval(fetchData);
  
  // User actions
  const userActions = useUserActions({
    setIsEditDialogOpen,
    setSelectedUser: setSelectedUser,
    setIsDeleteDialogOpen,
    setUserToDelete: setUserToDelete,
    resetPassword,
    approveUser,
    removeAccess: removeUserAccess
  });
  
  return {
    users: filteredUsers,
    loading,
    filter,
    setFilter,
    areas,
    cargos,
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
};
