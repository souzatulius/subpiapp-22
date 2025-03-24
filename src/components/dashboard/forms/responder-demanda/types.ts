
// Main types
export interface Area {
  id: string;
  descricao: string;
}

export interface Autor {
  nome_completo: string;
}

// Types for data from the API
export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  problema_id: string;
  problemas?: {
    id: string;
    descricao: string;
  };
  horario_publicacao: string;
  prazo_resposta: string;
  prioridade: string;
  origem_id?: string;
  origens_demandas?: {
    descricao: string;
  };
  tipo_midia_id?: string;
  tipos_midia?: {
    descricao: string;
  };
  servico_id?: string;
  servicos?: {
    descricao: string;
  };
  perguntas?: Record<string, string> | null;
  detalhes_solicitacao?: string;
  veiculo_imprensa?: string;
  nome_solicitante?: string;
  email_solicitante?: string;
  telefone_solicitante?: string;
  endereco?: string;
  bairro_id?: string;
  arquivo_url?: string;
  autor?: Autor;
}

// Props Interface
export interface ResponseFormData {
  demandaId: string;
  respostas: string;
}

export interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (prioridade: string) => void;
  areas: Area[];
}

export interface DemandaCardProps {
  demanda: Demanda;
  isSelected: boolean;
  onSelectDemanda: (demanda: Demanda) => void;
}

export interface DemandaGridProps {
  demandas: Demanda[];
  selectedDemanda: Demanda | null;
  onSelectDemanda: (demanda: Demanda) => void;
}

export interface DemandaListProps {
  demandas: Demanda[];
  selectedDemanda: Demanda | null;
  onSelectDemanda: (demanda: Demanda) => void;
}

export type ViewMode = 'list' | 'grid' | 'cards';
