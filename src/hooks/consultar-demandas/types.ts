
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
  criado_em?: string;
}

export type FilterType = 'all' | 'pending' | 'responded' | 'approved';

export interface UseDemandasDataReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDemand: Demand | null;
  setSelectedDemand: (demand: Demand | null) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  deleteLoading: boolean;
  filteredDemandas: Demand[];
  isLoading: boolean;
  error: any;
  refetch: () => Promise<any>;
  handleDeleteConfirm: () => Promise<void>;
}
