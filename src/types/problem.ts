
export interface Problem {
  id: string;
  descricao: string;
  supervisao_tecnica_id: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao?: string;
    coordenacao_id?: string;
  };
  criado_em: string;
  atualizado_em: string;
}

export const problemSchema = {
  descricao: '',
  supervisao_tecnica_id: ''
};
