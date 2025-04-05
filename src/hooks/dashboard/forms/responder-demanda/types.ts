
export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  perguntas?: Record<string, string> | string[];
  detalhes_solicitacao?: string;
  problema_id: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta?: string;
  supervisao_tecnica_id?: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
  };
  origem_id?: string;
  origem?: {
    descricao: string;
  };
  endereco?: string;
  bairro?: {
    id?: string;
    nome: string;
  };
}
