
import React from 'react';
import InviteUserDialog from './InviteUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import { User, SupervisaoTecnica, Cargo, Coordenacao } from './types';

interface UsersDialogsProps {
  supervisoesTecnicas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes: Coordenacao[];
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (value: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  selectedUser: User | null;
  userToDelete: User | null;
  handleInviteUser: (data: any) => Promise<void>;
  handleEditUser: (data: any) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  isEditSubmitting?: boolean;
}

const UsersDialogs: React.FC<UsersDialogsProps> = ({
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
  // Convert coordenacoes for InviteUserDialog
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

export default UsersDialogs;
