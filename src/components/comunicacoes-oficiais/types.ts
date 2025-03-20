
import { Json } from '@/integrations/supabase/types';

export interface Demand {
  id: string;
  titulo: string;
  status: string;
  horario_publicacao: string;
  prazo_resposta: string;
  areas_coordenacao: {
    id: string;
    descricao: string;
  };
  autor: {
    nome_completo: string;
  };
  perguntas?: Record<string, string>;
  detalhes_solicitacao?: string;
  [key: string]: any;
}

export interface ComunicacaoOficial {
  id?: string;
  titulo: string;
  texto: string;
  autor_id: string;
  area_coordenacao_id: string;
  criado_em?: string;
  atualizado_em?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  aprovador_id?: string;
  demanda_id: string;
}

export interface DemandaHeaderProps {
  titulo: string;
  status: string;
  protocolo?: string;
  prioridade?: string;
  horario_publicacao: string;
}

export interface ComunicacaoFormData {
  titulo: string;
  texto: string;
}

export interface PerguntaResposta {
  pergunta: string;
  resposta: string;
}

export interface DetalhesDemandaProps {
  demandaId: string;
  onClose: () => void;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  message?: string; // Keep the message property for backward compatibility
}

export interface LoadingStateProps {
  message?: string;
}
