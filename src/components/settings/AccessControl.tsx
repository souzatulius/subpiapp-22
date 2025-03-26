
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, Printer, RefreshCw } from 'lucide-react';
import AccessControlTable from './access-control/AccessControlTable';
import AccessControlHeader from './access-control/AccessControlHeader';
import UserInfoEditDialog from './access-control/UserInfoEditDialog';
import { useAccessControl } from './access-control/useAccessControl';

const AccessControl: React.FC = () => {
  const {
    permissions,
    userPermissions,
    loading,
    error,
    saving,
    filter,
    setFilter,
    filteredUsers,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentUser,
    currentUserId,
    openEditDialog,
    handleAddPermission,
    handleRemovePermission,
    handleUpdateUserInfo,
    handleExportCsv,
    handlePrint,
    fetchData,
  } = useAccessControl();

  return (
    <div className="space-y-6">
      <AccessControlHeader 
        filter={filter} 
        setFilter={setFilter} 
        handleExportCsv={handleExportCsv} 
        handlePrint={handlePrint}
        handleRefresh={fetchData}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-md shadow-sm">
        <AccessControlTable 
          filteredUsers={filteredUsers}
          permissions={permissions}
          userPermissions={userPermissions}
          loading={loading || saving}
          saving={saving}
          filter={filter}
          currentUserId={currentUserId}
          handleAddPermission={handleAddPermission}
          handleRemovePermission={handleRemovePermission}
          openEditDialog={openEditDialog}
        />
      </div>

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
