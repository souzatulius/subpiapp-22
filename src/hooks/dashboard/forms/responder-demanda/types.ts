
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

export interface Resposta {
    texto: string;
    respostas?: { [key: string]: string };
    comentarios?: string | null;
}

export interface Area {
    id: string;
    descricao: string;
}

export interface ResponderDemandaFormProps {
    onClose: () => void;
}

export type ViewMode = 'list' | 'cards';
