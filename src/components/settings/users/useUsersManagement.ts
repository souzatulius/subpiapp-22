
import { useUsersData } from './useUsersData';
import { useUsersFilter } from './useUsersFilter';
import { useUserInvite } from './hooks/useUserInvite';
import { useUserEdit } from './hooks/useUserEdit';
import { useUserDelete } from './hooks/useUserDelete';
import { usePasswordReset } from './hooks/usePasswordReset';
import { useUserActions } from './useUserActions';
import { useUserApproval } from './hooks/useUserApproval';

export const useUsersManagement = () => {
  // Fetch users data
  const { users, areas, cargos, loading, fetchData } = useUsersData();
  
  // Filter users
  const { filter, setFilter, filteredUsers } = useUsersFilter(users);
  
  // User invite functionality
  const { isInviteDialogOpen, setIsInviteDialogOpen, handleInviteUser } = useUserInvite(fetchData);
  
  // User edit functionality
  const { isEditDialogOpen, setIsEditDialogOpen, selectedUser, setSelectedUser, handleEditUser } = useUserEdit(fetchData);
  
  // User delete functionality
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, userToDelete, setUserToDelete, handleDeleteUser } = useUserDelete(fetchData);
  
  // Password reset functionality
  const { resetPassword } = usePasswordReset();
  
  // User approval functionality
  const { approving, approveUser } = useUserApproval(fetchData);
  
  // User actions
  const userActions = useUserActions({
    setIsEditDialogOpen,
    setSelectedUser,
    setIsDeleteDialogOpen,
    setUserToDelete,
    resetPassword,
    approveUser
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
    approving
  };
};
