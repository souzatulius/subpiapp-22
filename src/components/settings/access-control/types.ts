
export interface User {
  id: string;
  nome_completo: string;
  email: string;
  type: 'coordenacao' | 'supervisao_tecnica' | 'user';
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  whatsapp?: string;
  aniversario?: string;
  // Added for display purposes in UserInfoEditDialog
  coordenacao?: string;
  supervisao_tecnica?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  nivel_acesso: number;
}
