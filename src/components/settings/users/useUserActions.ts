
import { User } from './types';

interface UserActionsProps {
  setIsEditDialogOpen: (open: boolean) => void;
  setSelectedUser: (user: User | null) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setUserToDelete: (user: User | null) => void;
  resetPassword: (userId: string, userEmail: string) => Promise<void>;
  approveUser: (userId: string, userName: string, userEmail: string) => Promise<void>;
}

export const useUserActions = ({
  setIsEditDialogOpen,
  setSelectedUser,
  setIsDeleteDialogOpen,
  setUserToDelete,
  resetPassword,
  approveUser
}: UserActionsProps) => {
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetPassword = async (user: User) => {
    if (user.id && user.email) {
      await resetPassword(user.id, user.email);
    }
  };

  const handleApprove = async (user: User) => {
    if (user.id && user.nome_completo && user.email) {
      await approveUser(user.id, user.nome_completo, user.email);
    }
  };

  return {
    handleEdit,
    handleDelete,
    handleResetPassword,
    handleApprove
  };
};
