
import { User, SupervisaoTecnica, Cargo, Coordenacao, UserFormData } from '@/types/common';

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
  onRefresh?: () => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
}

export interface UsersTableProps {
  users: User[];
  loading: boolean;
  filter: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onApprove?: (user: User, roleName?: string) => void;
  onRemoveAccess?: (user: User) => void;
}

export interface UserDialogsProps {
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

export type UserStatus = 'aguardando_email' | 'pendente' | 'ativo' | 'excluido';

export type User = {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string | Date;
  foto_perfil_url?: string;
  cargo_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  criado_em?: string;
  status?: UserStatus;
  cargos?: {
    id: string;
    descricao: string;
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
  coordenacao?: {
    id: string;
    descricao: string;
  };
  permissoes?: Array<{
    id: string;
    descricao: string;
    nivel_acesso: number;
  }>;
};

export type SupervisaoTecnica = {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
};

export type Coordenacao = {
  id: string;
  descricao: string;
  sigla?: string;
};

export type Cargo = {
  id: string;
  descricao: string;
};

export type Area = SupervisaoTecnica;

export interface UserFormData {
  nome_completo: string;
  email?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  whatsapp?: string;
  aniversario?: Date;
  foto_perfil_url?: string;
  status?: UserStatus;
}
