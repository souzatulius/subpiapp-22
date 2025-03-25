
import { Database } from '@/integrations/supabase/types';

export interface Demand {
  id: string;
  titulo: string;
  status: string;
  area_coordenacao: {
    id: string;
    descricao: string;
  } | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
}

export interface DemandResponse {
  demanda_id: string;
  texto: string;
}

export interface ResponseQA {
  question: string;
  answer: string;
}

export interface CriarNotaFormProps {
  onClose: () => void;
}

export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  autor_id: string;
  problema_id: string;
  aprovador_id?: string;
  area_coordenacao_id?: string;
  demanda_id?: string;
  criado_em: string;
  atualizado_em: string;
  autor?: {
    id: string;
    nome_completo: string;
  };
  areas_coordenacao?: {
    id: string;
    descricao: string;
  };
}
