
export interface SelectOption {
  id?: string;
  value: string;
  label?: string;
  sigla?: string;
}

export interface FormData {
  name: string;
  email: string;
  birthday: string;
  whatsapp: string;
  role: string;
  area: string;
  coordenacao: string;
  confirmPassword: string;
}

export interface ProfileData {
  nome_completo: string;
  email: string;
  whatsapp?: string;
  aniversario?: string | Date;
  foto_perfil_url?: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
}
