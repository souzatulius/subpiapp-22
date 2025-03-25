
export interface UserProfile {
  nome_completo: string;
  cargo_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  foto_perfil_url?: string;
  whatsapp?: string;
  aniversario?: string | Date;
  cargo?: string;
  coordenacao?: string;
  supervisao_tecnica?: string;
  cargos?: {
    descricao: string;
  };
  coordenacao_info?: {
    descricao: string;
  };
  supervisao_tecnica_info?: {
    descricao: string;
    coordenacao_id: string;
  };
}
