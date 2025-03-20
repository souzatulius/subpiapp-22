
import React from 'react';
import UsersHeader from './UsersHeader';
import UsersTable from './UsersTable';
import UsersDialogs from './UsersDialogs';
import { User, Area, Cargo } from './types';

interface UsersLayoutProps {
  areas: Area[];
  cargos: Cargo[];
  loading: boolean;
  filter: string;
  setFilter: (value: string) => void;
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (value: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  currentUser: User | null;
  filteredUsers: User[];
  handleInviteUser: (data: any) => Promise<void>;
  handleEditUser: (data: any) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  handleSendPasswordReset: (email: string) => Promise<void>;
  openEditDialog: (user: User) => void;
  openDeleteDialog: (user: User) => void;
  handleExportCsv: () => void;
  handlePrint: () => void;
}

const UsersLayout: React.FC<UsersLayoutProps> = ({
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
}) => {
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
      
      <UsersDialogs
        areas={areas}
        cargos={cargos}
        isInviteDialogOpen={isInviteDialogOpen}
        setIsInviteDialogOpen={setIsInviteDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentUser={currentUser}
        handleInviteUser={handleInviteUser}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UsersLayout;
