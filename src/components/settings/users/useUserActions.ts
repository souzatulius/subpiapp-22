
import { User } from '@/types/common';

interface UserActionsProps {
  setIsEditDialogOpen: (open: boolean) => void;
  setSelectedUser: (user: User | null) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setUserToDelete: (user: User | null) => void;
  resetPassword: (user: User) => void;
  approveUser: (userId: string, userName: string, userEmail: string, roleName?: string) => void;
  removeAccess: (user: User) => void;
}

export const useUserActions = ({
  setIsEditDialogOpen,
  setSelectedUser,
  setIsDeleteDialogOpen,
  setUserToDelete,
  resetPassword,
  approveUser,
  removeAccess
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
    approveUser(user.id, user.nome_completo, user.email, roleName);
  };

  const handleRemoveAccess = (user: User) => {
    removeAccess(user);
  };

  return {
    handleEdit,
    handleDelete,
    handleResetPassword,
    handleApprove,
    handleRemoveAccess
  };
};
