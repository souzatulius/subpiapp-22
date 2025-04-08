
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
