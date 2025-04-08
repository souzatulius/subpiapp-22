
export interface ProfileData {
  nome_completo?: string;
  whatsapp?: string;
  aniversario?: Date | string;
  cargo?: {
    id: string;
    descricao: string;
  };
  coordenacao?: {
    id: string;
    descricao: string;
  };
  email?: string;
  foto_perfil_url?: string;
}

export interface UserProfile extends ProfileData {
  id: string;
  email: string;
  cargo?: string;
  cargo_id?: string;
  coordenacao?: string;
  coordenacao_id?: string;
  supervisao_tecnica?: string;
  status?: string;
}
