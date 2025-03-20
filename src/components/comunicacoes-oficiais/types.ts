
export interface ComunicacaoOficial {
  id: string;
  titulo: string;
  texto: string;
  autor_id: string;
  area_coordenacao_id: string;
  criado_em: string;
  atualizado_em: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  aprovador_id?: string;
  demanda_id?: string;
  autor?: {
    nome_completo: string;
  };
  areas_coordenacao?: {
    descricao: string;
    id: string;
  };
}

export interface Demand {
  id: string;
  titulo: string;
  status: string;
  horario_publicacao: string;
  prazo_resposta: string;
  detalhes_solicitacao?: string;
  arquivo_url?: string;
  autor?: {
    nome_completo: string;
  };
  areas_coordenacao?: {
    descricao: string;
    id: string;
  };
  perguntas?: Record<string, string>;
}

export interface PerguntaResposta {
  pergunta: string;
  resposta: string;
}

export interface DetalhesDemandaProps {
  demandaId: string;
  onClose: () => void;
}

export interface LoadingStateProps {
  message: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  action: React.ReactNode;
}

export interface DemandaHeaderProps {
  titulo: string;
  status: string;
  protocolo?: string;
  prioridade?: string;
  horario_publicacao: string;
}
