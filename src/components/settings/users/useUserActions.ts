
import { User } from './types';

interface UserActionsProps {
  setIsEditDialogOpen: (open: boolean) => void;
  setSelectedUser: (user: User) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setUserToDelete: (user: User) => void;
  resetPassword: (user: User) => void;
  approveUser: (user: User, roleName?: string) => void;
  removeAccess: (user: User) => void;
  manageRoles?: (user: User) => void;
}

export const useUserActions = ({
  setIsEditDialogOpen,
  setSelectedUser,
  setIsDeleteDialogOpen,
  setUserToDelete,
  resetPassword,
  approveUser,
  removeAccess,
  manageRoles
}: UserActionsProps) => {
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    resetPassword(user);
  };

  const handleApprove = (user: User, roleName: string = 'leitor') => {
    approveUser(user, roleName);
  };

  const handleRemoveAccess = (user: User) => {
    removeAccess(user);
  };
  
  const handleManageRoles = (user: User) => {
    if (manageRoles) {
      manageRoles(user);
    }
  };

  return {
    handleEdit,
    handleDelete,
    handleResetPassword,
    handleApprove,
    handleRemoveAccess,
    handleManageRoles
  };
};
