
export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  problema?: {
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
  horario_publicacao?: string;
  servico?: {
    descricao: string;
  } | null;
  origem?: {
    descricao: string;
  } | null;
  bairro?: {
    nome: string;
  } | null;
  arquivo_url?: string | null;
  arquivo_nome?: string | null;
  autor?: {
    nome_completo: string;
  } | null;
}

export type FilterType = 'all' | 'pending' | 'responded' | 'approved';
