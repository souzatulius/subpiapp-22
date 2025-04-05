
export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao?: string;
  prazo_resposta?: string;
  created_at?: string;
  area_coordenacao?: {
    id: string;
    descricao: string;
  };
  problema?: {
    id: string;
    descricao: string;
    coordenacao?: {
      id: string;
      descricao: string;
    };
  };
  endereco?: string;
  bairro?: {
    id: string;
    nome: string;
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
}
