
import { User } from './types';

interface UserActionsProps {
  setIsEditDialogOpen: (open: boolean) => void;
  setSelectedUser: (user: User | null) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setUserToDelete: (user: User | null) => void;
  resetPassword: (userId: string, userEmail: string) => Promise<void>;
  approveUser: (userId: string, userName: string, userEmail: string, permissionLevel?: string) => Promise<void>;
  removeAccess?: (userId: string, userName: string) => Promise<void>;
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

  const handleResetPassword = async (user: User) => {
    if (user.id && user.email) {
      await resetPassword(user.id, user.email);
    }
  };

  const handleApprove = async (user: User, permissionLevel?: string) => {
    if (user.id && user.nome_completo && user.email) {
      await approveUser(user.id, user.nome_completo, user.email, permissionLevel);
    }
  };

  const handleRemoveAccess = async (user: User) => {
    if (user.id && user.nome_completo && removeAccess) {
      await removeAccess(user.id, user.nome_completo);
    }
  };

  return {
    handleEdit,
    handleDelete,
    handleResetPassword,
    handleApprove,
    handleRemoveAccess
  };
};
