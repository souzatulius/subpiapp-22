
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

export type UserStatus = 'aguardando_email' | 'pendente' | 'ativo' | 'excluido';

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
  aniversario?: Date | undefined;
  foto_perfil_url?: string;
  status?: UserStatus;
}

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
  userActions: {
    handleEdit: (user: User) => void;
    handleDelete: (user: User) => void;
    handleResetPassword: (user: User) => void;
    handleApprove: (user: User, roleName?: string) => void;
    handleRemoveAccess: (user: User) => void;
  };
  approving: boolean;
  removing: boolean;
  isEditSubmitting?: boolean;
  onRefresh?: () => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
}
