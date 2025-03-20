import React, { useEffect } from 'react';
import AccessControlHeader from './access-control/AccessControlHeader';
import AccessControlTable from './access-control/AccessControlTable';
import UserInfoEditDialog from './access-control/UserInfoEditDialog';
import { useAccessControl } from './access-control/useAccessControl';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccessControl = () => {
  const {
    permissions,
    userPermissions,
    loading,
    error,
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

  useEffect(() => {
    console.log('AccessControl component:', {
      permissionsCount: permissions.length,
      permissions: permissions,
      userPermissionsCount: Object.keys(userPermissions).length,
      currentUserId,
      error
    });
    
    if (permissions.length === 0 && !loading && !error) {
      console.warn('Nenhuma permissão disponível. Verificando dados...');
      fetchData();
    }
  }, [permissions, userPermissions, currentUserId, fetchData, loading, error]);

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <p>Ocorreu um erro ao carregar o controle de acesso: {error}</p>
            <Button 
              variant="outline" 
              className="w-fit"
              onClick={() => fetchData()}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
