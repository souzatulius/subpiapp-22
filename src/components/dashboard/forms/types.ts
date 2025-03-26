
import { Database } from '@/integrations/supabase/types';
import { NotaOficial } from '@/types/nota';

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

// Re-export the NotaOficial type from the central type definition
export type { NotaOficial };
