
export type Filter = 'all' | 'alta' | 'media' | 'baixa';

export interface Area {
  id: string;
  descricao: string;
}

export interface Origem {
  id: string;
  descricao: string;
}

export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  prazo_resposta: string;
  perguntas: Record<string, string> | string[] | null;
  detalhes_solicitacao: string;
  areas_coordenacao: {
    id: string;
    descricao: string;
  };
  origens_demandas?: {
    descricao: string;
  };
  tipos_midia?: {
    descricao: string;
  };
  servicos?: {
    descricao: string;
  };
  arquivo_url?: string;
  arquivo_nome?: string | null;
}
