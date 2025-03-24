
import { Database } from '@/integrations/supabase/types';

export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  problema: {
    id: string;
    descricao: string;
  } | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
  veiculo_imprensa?: string | null;
  nome_solicitante?: string | null;
  email_solicitante?: string | null;
  telefone_solicitante?: string | null;
  endereco?: string | null;
  criado_em?: string;
  horario_publicacao?: string;
}

export interface DemandResponse {
  demanda_id: string;
  texto: string;
  respostas?: Record<string, string> | null;
}

export interface ResponseQA {
  question: string;
  answer: string;
}

export interface CriarNotaFormProps {
  onClose: () => void;
}
