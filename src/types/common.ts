
export interface SupervisaoTecnica {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
}

export interface Coordenacao {
  id: string;
  descricao: string;
  sigla?: string;
}

export interface Cargo {
  id: string;
  descricao: string;
}

export interface User {
  id: string;
  nome_completo: string;
  email: string;
  cargo_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  whatsapp?: string;
  aniversario?: string | Date;
  foto_perfil_url?: string;
  permissoes?: any[];
  cargos?: {
    descricao: string;
  };
  supervisao_tecnica?: {
    descricao: string;
  };
  coordenacao?: {
    descricao: string;
  };
  criado_em?: string;
}

export interface UserProfile {
  id?: string;
  nome_completo: string;
  cargo?: string;
  supervisao_tecnica?: string;
  coordenacao?: string;
  foto_perfil_url?: string;
  avatar_url?: string; // Alias for foto_perfil_url
  whatsapp?: string;
  aniversario?: string | Date;
  email?: string;
  cargo_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  cargos?: {
    descricao: string;
  };
  supervisao_tecnica_info?: {
    descricao: string;
    coordenacao_id: string;
  };
}

export interface UserFormData {
  nome_completo: string;
  email: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  whatsapp?: string;
  aniversario?: Date;
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
