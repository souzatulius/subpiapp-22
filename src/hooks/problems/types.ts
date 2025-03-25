
export interface Problem {
  id: string;
  descricao: string;
  supervisao_tecnica_id: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
    coordenacao?: string;
    coordenacao_id?: string;
  };
  criado_em: string;
  atualizado_em: string;
}

export interface Area {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
  coordenacao?: string;
}
