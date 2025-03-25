
export interface User {
  id: string;
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string;
  foto_perfil_url?: string;
  cargo_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  criado_em?: string;
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
}

export interface UserProfile {
  id?: string;
  nome_completo: string;
  email?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  foto_perfil_url?: string;
  avatar_url?: string; // Alternativa para foto_perfil_url
  whatsapp?: string;
  aniversario?: string;
  cargo?: string;
  supervisao_tecnica?: string;
  coordenacao?: string;
  cargos?: {
    descricao: string;
  };
  supervisao_tecnica_info?: {
    descricao: string;
    coordenacao_id?: string;
  };
}

export interface SupervisaoTecnica {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
  criado_em?: string;
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

export interface UserFormData {
  nome_completo: string;
  email?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  whatsapp?: string;
  aniversario?: Date;
}

// Helper function for date formatting
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'Data não informada';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return 'Data inválida';
  }
};
