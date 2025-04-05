
export interface NotaOficial {
  id: string;
  titulo: string;
  conteudo: string;
  status: string;
  criado_em?: string;
  created_at?: string;
  autor?: {
    id: string;
    nome_completo: string;
  };
  problema?: {
    id: string;
    descricao: string;
    coordenacao?: {
      id: string;
      descricao: string;
    }
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
  area_coordenacao?: {
    id: string;
    descricao: string;
  };
}
