
import React, { useEffect } from 'react';
import AccessControlHeader from './access-control/AccessControlHeader';
import AccessControlTable from './access-control/AccessControlTable';
import UserInfoEditDialog from './access-control/UserInfoEditDialog';
import { useAccessControl } from './access-control/useAccessControl';
import { toast } from '@/components/ui/use-toast';

const AccessControl = () => {
  const {
    permissions,
    userPermissions,
    loading,
    saving,
    filter,
    setFilter,
    filteredUsers,
    handleAddPermission,
    handleRemovePermission,
    handleUpdateUserInfo,
    handleExportCsv,
    handlePrint,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    currentUserId,
    openEditDialog,
    fetchData,
  } = useAccessControl();

  // Add debug information
  useEffect(() => {
    console.log('AccessControl component:', {
      permissionsCount: permissions.length,
      permissions: permissions,
      userPermissionsCount: Object.keys(userPermissions).length,
      currentUserId
    });
    
    if (permissions.length === 0) {
      console.warn('Nenhuma permissão disponível. Verificando dados...');
      fetchData();
    }
  }, [permissions, userPermissions, currentUserId, fetchData]);

  return (
    <div className="space-y-6">
      <AccessControlHeader
        filter={filter}
        setFilter={setFilter}
        handleExportCsv={handleExportCsv}
        handlePrint={handlePrint}
      />
      
      <AccessControlTable
        filteredUsers={filteredUsers}
        permissions={permissions}
        userPermissions={userPermissions}
        loading={loading}
        saving={saving}
        filter={filter}
        currentUserId={currentUserId}
        handleAddPermission={handleAddPermission}
        handleRemovePermission={handleRemovePermission}
        openEditDialog={openEditDialog}
      />
      
      <UserInfoEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={currentUser}
        onSave={handleUpdateUserInfo}
        saving={saving}
      />
    </div>
  );
};

export default AccessControl;
