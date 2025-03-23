
export interface UserProfile {
  nome_completo: string;
  cargo_id: string;
  area_coordenacao_id: string;
  foto_perfil_url?: string;
  whatsapp?: string;
  aniversario?: string;
  cargos?: {
    descricao: string;
  };
  areas_coordenacao?: {
    descricao: string;
  };
}
