
import React from 'react';
import { useUsersManagement } from './users/useUsersManagement';
import UsersHeader from './users/UsersHeader';
import UsersTable from './users/UsersTable';
import InviteUserDialog from './users/InviteUserDialog';
import EditUserDialog from './users/EditUserDialog';
import DeleteUserDialog from './users/DeleteUserDialog';

const UsersManagement = () => {
  const {
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
    handleExportCsv,
    handlePrint,
  } = useUsersManagement();

  return (
    <div className="space-y-6">
      <UsersHeader 
        filter={filter}
        setFilter={setFilter}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
        onInvite={() => setIsInviteDialogOpen(true)}
      />
      
      <UsersTable 
        users={filteredUsers}
        loading={loading}
        filter={filter}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        onPasswordReset={handleSendPasswordReset}
      />
      
      <InviteUserDialog 
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
        areas={areas}
        cargos={cargos}
      />
      
      <EditUserDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={currentUser}
        onSubmit={handleEditUser}
        areas={areas}
        cargos={cargos}
      />
      
      <DeleteUserDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={currentUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default UsersManagement;
