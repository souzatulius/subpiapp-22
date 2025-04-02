
import { useState } from 'react';
import { useAccessControlData, Coordenacao } from './useAccessControlData';
import { usePermissionsManagement } from './usePermissionsManagement';

export const useAccessControl = () => {
  const [currentCoordination, setCurrentCoordination] = useState<Coordenacao | null>(null);

  const {
    coordenacoes,
    permissions,
    coordinationPermissions,
    setCoordinationPermissions,
    loading,
    error,
    fetchData
  } = useAccessControlData();

  const {
    saving,
    handleAddPermission,
    handleRemovePermission
  } = usePermissionsManagement(coordinationPermissions, setCoordinationPermissions, fetchData);

  return {
    coordenacoes,
    permissions,
    coordinationPermissions,
    loading,
    error,
    saving,
    currentCoordination,
    setCurrentCoordination,
    handleAddPermission,
    handleRemovePermission
  };
};
