
import { User } from './types';
import { useUserInvite } from './hooks/useUserInvite';
import { useUserEdit } from './hooks/useUserEdit';
import { useUserDelete } from './hooks/useUserDelete';
import { usePasswordReset } from './hooks/usePasswordReset';

export const useUserActions = (fetchData: () => Promise<void>) => {
  const {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser
  } = useUserInvite(fetchData);

  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser: editUser,
    handleEditUser,
    openEditDialog
  } = useUserEdit(fetchData);

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser: deleteUser,
    handleDeleteUser,
    openDeleteDialog
  } = useUserDelete(fetchData);

  const { handleSendPasswordReset } = usePasswordReset();

  // Combine current user from edit and delete hooks
  const currentUser = editUser || deleteUser;

  return {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser,
    handleInviteUser,
    handleEditUser,
    handleDeleteUser,
    handleSendPasswordReset,
    openEditDialog,
    openDeleteDialog,
  };
};
