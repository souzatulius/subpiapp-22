
export interface NotaOficial {
  id: string;
  titulo: string;
  conteudo: string;
  texto?: string; // Alias for conteudo for backward compatibility
  status: string;
  criado_em?: string;
  created_at?: string;
  atualizado_em?: string;
  updated_at?: string;
  autor?: {
    id: string;
    nome_completo: string;
  };
  aprovador?: {
    id: string;
    nome_completo: string;
  } | null;
  problema?: {
    id: string;
    descricao: string;
    coordenacao?: {
      id: string;
      descricao: string;
    } | null;
  } | null;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  } | null;
  area_coordenacao?: {
    id: string;
    descricao: string;
  } | null;
  demanda?: {
    id: string;
    titulo: string;
  } | null;
  demanda_id?: string | null;
  problema_id?: string | null;
  historico_edicoes?: Array<{
    id: string;
    editor_id: string;
    criado_em: string;
    titulo_anterior?: string;
    titulo_novo?: string;
    texto_anterior: string;
    texto_novo: string;
    nota_id: string;
    editor?: {
      id: string;
      nome_completo: string;
    };
  }>;
}

export interface NotaEdicao {
  id: string;
  editor_id: string;
  criado_em: string;
  titulo_anterior?: string;
  titulo_novo?: string;
  texto_anterior: string;
  texto_novo: string;
  nota_id: string;
  editor?: {
    id: string;
    nome_completo: string;
  };
}

export interface UseNotasDataReturn {
  notas: NotaOficial[];
  loading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredNotas: NotaOficial[];
  selectedNota: NotaOficial | null;
  setSelectedNota: (nota: NotaOficial | null) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  deleteLoading: boolean;
  handleDelete: (id: string) => Promise<void>;
  refetch: () => Promise<any>;
  selectedNotaId: string | null;
  setSelectedNotaId: (id: string | null) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  // Extended properties needed by NotasContent
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  areaFilter?: string;
  setAreaFilter?: (area: string) => void;
  dataInicioFilter?: string;
  setDataInicioFilter?: (date: string) => void;
  dataFimFilter?: string;
  setDataFimFilter?: (date: string) => void;
  isAdmin?: boolean;
  updateNotaStatus?: (id: string, status: string) => Promise<void>;
  statusLoading?: boolean;
  fetchNotas?: () => Promise<void>;
}
