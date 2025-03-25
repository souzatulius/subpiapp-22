export interface User {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string;
  foto_perfil_url?: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  criado_em: string;
  cargos?: {
    id: string;
    descricao: string;
  };
  areas_coordenacao?: {
    id: string;
    descricao: string;
  };
  permissoes: Permission[];
}

export interface UserFormData {
  nome_completo: string;
  email: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  whatsapp?: string;
  aniversario?: Date;
}

export interface Permission {
  id: string;
  descricao: string;
  nivel_acesso: number;
}

export interface Cargo {
  id: string;
  descricao: string;
}

export interface Area {
  id: string;
  descricao: string;
}

export interface UsersLayoutProps {
  users: User[];
  loading: boolean;
  filter: string;
  setFilter: (value: string) => void;
  areas: Area[];
  cargos: Cargo[];
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (open: boolean) => void;
  handleInviteUser: (data: any) => Promise<void>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  handleEditUser: (data: any) => Promise<void>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  userToDelete: User | null;
  handleDeleteUser: () => Promise<void>;
  userActions: {
    handleEdit: (user: User) => void;
    handleDelete: (user: User) => void;
    handleResetPassword: (user: User) => void;
    handleApprove: (user: User, permissionLevel?: string) => void;
    handleRemoveAccess: (user: User) => void;
  };
  approving: boolean;
  removing: boolean;
}
