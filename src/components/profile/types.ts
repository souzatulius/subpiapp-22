
export interface ProfileData {
  nome_completo: string;
  whatsapp?: string;
  aniversario?: Date | string;
  foto_perfil_url?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  cargo?: string;
  coordenacao?: string;
  supervisao_tecnica?: string;
}

export interface AccountSettingsData {
  notificar_demandas?: boolean;
  notificar_comunicados?: boolean;
  email_notificacoes?: boolean;
}
