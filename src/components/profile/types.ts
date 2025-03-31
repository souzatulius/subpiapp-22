
export interface ProfileData {
  nome_completo: string;
  whatsapp?: string;
  aniversario?: Date | string;
  foto_perfil_url?: string;
}

export interface AccountSettingsData {
  notificar_demandas?: boolean;
  notificar_comunicados?: boolean;
  email_notificacoes?: boolean;
}
