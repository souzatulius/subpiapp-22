
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  nome_completo: string;
  cargo_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  cargo?: string;
  supervisao_tecnica?: string;
  coordenacao?: string;
}

export interface AccessControlEntity {
  id: string;
  name: string;
  type: 'coordenacao' | 'supervisao_tecnica';
  parentId?: string; // For supervisões técnicas, points to coordenação
}
