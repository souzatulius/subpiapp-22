
export interface Demanda {
  id: string;
  titulo: string;
  problema_id: string;
  servico_id?: string; // Make optional
  supervisao_tecnica_id?: string;
  areas_coordenacao?: {
    id?: string;
    descricao: string;
  } | null;
  servicos?: {
    descricao: string;
  } | null;
  origens_demandas?: {
    descricao: string;
  } | null;
  tipos_midia?: {
    descricao: string;
  } | null;
  status: string;
  prioridade: string;
  prazo_resposta: string;
  detalhes_solicitacao?: string;
  perguntas?: Record<string, string> | string[] | null;
}

export interface Area {
  id: string;
  descricao: string;
}

export type ViewMode = 'list' | 'cards';
