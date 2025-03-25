
export interface UsersLayoutProps {
  users: User[];
  loading: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  supervisoesTecnicas: SupervisaoTecnica[];
  cargos: Cargo[];
  coordenacoes: Coordenacao[];
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (open: boolean) => void;
  handleInviteUser: (data: any) => Promise<void>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  handleEditUser: (data: UserFormData) => Promise<void>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  userToDelete: User | null;
  handleDeleteUser: () => Promise<void>;
  userActions: any;
  approving: boolean;
  removing: boolean;
  isEditSubmitting?: boolean;
}

export interface UsersTableProps {
  users: User[];
  loading: boolean;
  filter: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onApprove?: (user: User, permissionLevel: string) => void;
  onRemoveAccess?: (user: User) => void;
}

import { User, SupervisaoTecnica, Cargo, Coordenacao, UserFormData } from './common';
