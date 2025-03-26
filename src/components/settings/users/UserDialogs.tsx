
import React from 'react';
import InviteUserDialog from './InviteUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import EditUserDialog from './EditUserDialog';
import { UserDialogsProps } from '@/types/users';

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
  isEditSubmitting
}) => {
  return (
    <>
      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
        areas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={coordenacoes.map(c => ({ coordenacao_id: c.id, coordenacao: c.descricao }))}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onSubmit={handleEditUser}
        supervisoesTecnicas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={coordenacoes}
        isSubmitting={isEditSubmitting}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onDelete={handleDeleteUser}
      />
    </>
  );
};

export default UserDialogs;
