
export interface RegisterFormProps {
  roles: SelectOption[];
  areas: SelectOption[];
  coordenacoes: SelectOption[];
  loadingOptions: boolean;
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

export interface SelectOption {
  id: string;
  value: string;
  sigla?: string;
}

export interface PasswordRequirement {
  regex: RegExp;
  text: string;
  fulfilled: boolean;
}
