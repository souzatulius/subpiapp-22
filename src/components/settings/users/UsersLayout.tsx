
import React from 'react';
import UsersHeader from './UsersHeader';
import UsersTable from './UsersTable';
import UsersDialogs from './UsersDialogs';

const UsersLayout = (props: any) => {
  const {
    users,
    loading,
    filter,
    setFilter,
    areas,
    cargos,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    handleInviteUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedUser,
    handleEditUser,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    handleDeleteUser,
    userActions,
    approving,
    removing
  } = props;

  return (
    <div className="space-y-6">
      <UsersHeader
        filter={filter}
        setFilter={setFilter}
        onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
      />
      
      <UsersTable
        users={users}
        loading={loading}
        filter={filter}
        onEdit={userActions.handleEdit}
        onDelete={userActions.handleDelete}
        onResetPassword={userActions.handleResetPassword}
        onApprove={userActions.handleApprove}
        onRemoveAccess={userActions.handleRemoveAccess}
      />
      
      <UsersDialogs
        isInviteDialogOpen={isInviteDialogOpen}
        setIsInviteDialogOpen={setIsInviteDialogOpen}
        handleInviteUser={handleInviteUser}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedUser={selectedUser}
        handleEditUser={handleEditUser}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        handleDeleteUser={handleDeleteUser}
        areas={areas}
        cargos={cargos}
      />
    </div>
  );
};

export default UsersLayout;
