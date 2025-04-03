
export interface ProfileData {
  nome_completo: string;
  whatsapp?: string;
  aniversario?: string | Date | null;
  foto_perfil_url?: string;
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
