
export interface User {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string;
}

export interface Permission {
  id: string;
  descricao: string;
  nivel_acesso: number;
}

export interface UserPermissionMapping {
  [userId: string]: string[];
}
