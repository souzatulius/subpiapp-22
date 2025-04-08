
export interface SelectOption {
  id?: string;  // Making it optional for backward compatibility
  value: string;
  label: string;
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
