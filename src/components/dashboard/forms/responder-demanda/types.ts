
export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  problema_id: string;
  origem_id: string;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  areas_coordenacao: {
    id: string;
    descricao: string;
  } | null;
  origens_demandas: {
    descricao: string;
  };
  tipos_midia: {
    descricao: string;
  };
}

export interface Area {
  id: string;
  descricao: string;
}

export type ViewMode = 'list' | 'cards';

export interface ResponderDemandaFormProps {
  onClose: () => void;
}
