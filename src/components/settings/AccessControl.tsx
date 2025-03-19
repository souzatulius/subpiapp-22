
import React from 'react';
import AccessControlHeader from './access-control/AccessControlHeader';
import AccessControlTable from './access-control/AccessControlTable';
import { useAccessControl } from './access-control/useAccessControl';

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
    handleExportCsv,
    handlePrint,
  } = useAccessControl();

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
        handleAddPermission={handleAddPermission}
        handleRemovePermission={handleRemovePermission}
      />
    </div>
  );
};

export default AccessControl;
