
export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  autor?: {
    id?: string;
    nome_completo?: string;
  };
  area_coordenacao?: {
    id?: string;
    descricao?: string;
  };
  demanda?: {
    id?: string;
    titulo?: string;
  };
  supervisao_tecnica?: {
    id?: string;
    descricao?: string;
  };
  status: string;
  created_at: string;
  updated_at?: string;
  problema?: {
    id?: string;
    descricao?: string;
  };
  revisado_por?: {
    id?: string;
    nome_completo?: string;
  };
  revisado_em?: string;
}
