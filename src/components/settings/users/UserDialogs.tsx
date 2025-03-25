
import React from 'react';
import { User, UserFormData, SupervisaoTecnica, Coordenacao, Cargo } from './types';
import UserInviteDialog from './UserInviteDialog';
import UserEditDialog from './UserEditDialog';
import UserDeleteDialog from './UserDeleteDialog';

interface UserDialogsProps {
  supervisoesTecnicas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes: Coordenacao[];
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  userToDelete: User | null;
  handleInviteUser: (data: any) => Promise<void>;
  handleEditUser: (data: UserFormData) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  isEditSubmitting?: boolean;
}

const UserDialogs: React.FC<UserDialogsProps> = ({
  supervisoesTecnicas,
  cargos,
  coordenacoes,
  isInviteDialogOpen,
  setIsInviteDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedUser,
  userToDelete,
  handleInviteUser,
  handleEditUser,
  handleDeleteUser,
  isEditSubmitting,
}) => {
  return (
    <>
      <UserInviteDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={coordenacoes}
      />
      
      <UserEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onSubmit={handleEditUser}
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={coordenacoes}
        isSubmitting={isEditSubmitting}
      />
      
      <UserDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleDeleteUser}
      />
    </>
  );
};

export default UserDialogs;
