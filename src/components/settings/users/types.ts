
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
