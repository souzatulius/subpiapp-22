
import React from 'react';
import { User, UserFormData, SupervisaoTecnica, Cargo, Coordenacao } from './types';
import InviteUserDialog from './InviteUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';

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
  // Format coordenacoes for InviteUserDialog
  const formattedCoordenacoes = coordenacoes.map(coord => ({
    coordenacao_id: coord.id,
    coordenacao: coord.descricao
  }));

  return (
    <>
      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
        areas={supervisoesTecnicas}
        cargos={cargos}
        coordenacoes={formattedCoordenacoes}
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
