import { useState } from 'react';
import { useAccessControlData } from './useAccessControlData';
import { usePermissionsManagement } from './usePermissionsManagement';
import { User } from './types';

export const useAccessControl = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Carregamento dos dados de usuários, permissões e relações
  const {
    users,
    setUsers,
    permissions,
    userPermissions,
    setUserPermissions,
    loading,
    error,
    fetchData
  } = useAccessControlData();

  // Gerenciamento de permissões (adicionar/remover)
  const {
    saving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(userPermissions, setUserPermissions, fetchData);

  // Abrir modal de edição (se necessário futuramente)
  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  return {
    users,
    permissions,
    userPermissions,
    loading,
    error,
    saving,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    openEditDialog,
    handleAddPermission,
    handleRemovePermission
  };
};
