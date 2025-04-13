
export interface ProfileData {
  id?: string;
  nome_completo: string;
  whatsapp?: string;
  aniversario?: string | Date | null;
  email?: string;
  foto_perfil_url?: string | null;
  cargo?: {
    descricao: string;
  } | string;
  coordenacao?: {
    descricao: string;
  } | string;
  supervisao_tecnica?: {
    descricao: string;
  } | string;
}

export interface NotificationPreferences {
  app: boolean;
  email: boolean;
  whatsapp: boolean;
  resumo_diario: boolean;
}
