
export interface User {
  id: string;
  nome_completo: string;
  email: string;
  aniversario?: string;
  whatsapp?: string;
  foto_perfil_url?: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  cargos?: {
    id: string;
    descricao: string;
  };
  areas_coordenacao?: {
    id: string;
    descricao: string;
  };
}

export interface Area {
  id: string;
  descricao: string;
}

export interface Cargo {
  id: string;
  descricao: string;
}

export interface UserFormData {
  email: string;
  nome_completo: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  whatsapp?: string;
  aniversario?: Date;
}
