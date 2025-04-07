
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
  coordenacao_id?: string;
  problema?: {
    id: string;
    descricao: string;
    coordenacao?: {
      id: string;
      descricao: string;
    };
  };
  problema_id?: string;
  endereco?: string;
  bairro?: {
    id: string;
    nome: string;
  };
  origem?: {
    id: string;
    descricao: string;
  };
  tipo_midia?: {
    id: string;
    descricao: string;
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
  notas?: Array<{
    id: string;
    titulo: string;
    status: string;
  }>;
  comentarios?: Array<{
    texto: string;
    autor: string;
    data: string;
  }>;
  respostas?: Array<{
    id: string;
    texto: string;
  }>;
}
