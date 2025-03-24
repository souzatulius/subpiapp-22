
import { Database } from '@/integrations/supabase/types';

export interface Demand {
  id: string;
  titulo: string;
  status: string;
  problema_id: string;
  problema?: {
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
  criado_em: string;
  autor_id: string;
  aprovador_id?: string | null;
  problema_id: string;
  demanda_id?: string | null;
  autor?: {
    id?: string;
    nome_completo: string;
  };
  problemas?: {
    id?: string;
    descricao: string;
  };
  demanda?: any;
}
