
export interface SelectOption {
  value: string;
  label: string;
  id?: string;  // Added to support PositionFields.tsx
  sigla?: string; // Added to support coordination display in PositionFields.tsx
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
