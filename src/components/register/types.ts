
export interface FormData {
  name: string;
  email: string;
  birthday: string;
  whatsapp: string;
  role: string;
  area: string;
  confirmPassword: string;
}

export interface SelectOption {
  id: string;
  value: string;
}

export interface RegisterFormProps {
  roles: SelectOption[];
  areas: SelectOption[];
  loadingOptions: boolean;
}
