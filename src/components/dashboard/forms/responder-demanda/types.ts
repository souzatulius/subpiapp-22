
export type Filter = 'all' | 'alta' | 'media' | 'baixa';

export interface Problema {
  id: string;
  descricao: string;
}

export type Area = Problema; // For backward compatibility

export type ViewMode = 'list' | 'grid' | 'cards';

export interface ResponderDemandaFormProps {
  onClose?: () => void;
}

export interface Origem {
  id: string;
  descricao: string;
}

export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  prazo_resposta: string;
  perguntas: Record<string, string> | string[] | null;
  detalhes_solicitacao: string;
  problema: {
    id: string;
    descricao: string;
  };
  origens_demandas?: {
    descricao: string;
  };
  tipos_midia?: {
    descricao: string;
  };
  servicos?: {
    descricao: string;
  };
  arquivo_url?: string;
  arquivo_nome?: string | null;
}

export interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  counts: Record<Filter, number>;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (prioridade: string) => void;
  areas: Problema[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoadingDemandas: boolean;
}
