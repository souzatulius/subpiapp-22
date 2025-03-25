
export type User = {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string;
  foto_perfil_url?: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  coordenacao_id?: string;
  criado_em?: string;
  cargos?: {
    id: string;
    descricao: string;
  };
  areas_coordenacao?: {
    id: string;
    descricao: string;
    coordenacao?: string;
    coordenacao_id?: string;
  };
  permissoes?: Array<{
    id: string;
    descricao: string;
    nivel_acesso: number;
  }>;
};

export type Area = {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao?: string;
  coordenacao_id?: string;
};

export type Cargo = {
  id: string;
  descricao: string;
};

export interface UserFormData {
  nome_completo: string;
  email?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  area_coordenacao_id?: string;
  whatsapp?: string;
  aniversario?: Date;
}

export interface UsersLayoutProps {
  users: User[];
  loading: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  areas: Area[];
  cargos: Cargo[];
  coordenacoes?: {coordenacao_id: string, coordenacao: string}[];
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
}
