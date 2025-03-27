
export interface User {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string;
  foto_perfil_url?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
}

export interface Permission {
  id: string;
  descricao: string;
  nivel_acesso: number;
}

export interface UserPermissionMapping {
  [userId: string]: string[];
}
