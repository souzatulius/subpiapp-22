
import { useUsersData } from './useUsersData';
import { useUsersFilter } from './useUsersFilter';
import { useUserActions } from './useUserActions';
import { handleExportCsv, handlePrint } from './userExportUtils';
export type { User, Area, Cargo } from './types';

export const useUsersManagement = () => {
  const { users, areas, cargos, loading, fetchData } = useUsersData();
  const { filter, setFilter, filteredUsers } = useUsersFilter(users);
  const {
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
  } = useUserActions(fetchData);

  const exportCsv = () => handleExportCsv(filteredUsers);

  return {
    users,
    areas,
    cargos,
    loading,
    filter,
    setFilter,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentUser,
    filteredUsers,
    handleInviteUser,
    handleEditUser,
    handleDeleteUser,
    handleSendPasswordReset,
    openEditDialog,
    openDeleteDialog,
    handleExportCsv: exportCsv,
    handlePrint,
  };
};
