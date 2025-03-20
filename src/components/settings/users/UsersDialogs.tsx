
import React from 'react';
import InviteUserDialog from './InviteUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import { User, Area, Cargo } from './types';

interface UsersDialogsProps {
  areas: Area[];
  cargos: Cargo[];
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (value: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  currentUser: User | null;
  handleInviteUser: (data: any) => Promise<void>;
  handleEditUser: (data: any) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
}

const UsersDialogs: React.FC<UsersDialogsProps> = ({
  areas,
  cargos,
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
}) => {
  return (
    <>
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
    </>
  );
};

export default UsersDialogs;
