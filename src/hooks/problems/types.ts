
export interface Problem {
  id: string;
  descricao: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao?: {
    id: string;
    descricao: string;
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
}
