
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
  };
  problema?: {
    id: string;
    descricao: string;
    coordenacao?: {
      id: string;
      descricao: string;
    }
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
  area_coordenacao?: {
    id?: string;
    descricao: string;
  };
  demanda?: {
    id: string;
    titulo: string;
  };
  demanda_id?: string;
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
  // Extended properties for compatibility
  isLoading?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
  formatDate?: (date: string) => string;
  areaFilter?: string;
  setAreaFilter?: (area: string) => void;
  dataInicioFilter?: string | Date;
  setDataInicioFilter?: (date: string | Date) => void;
  dataFimFilter?: string | Date;
  setDataFimFilter?: (date: string | Date) => void;
  deleteNota?: (id: string) => Promise<void>;
  isAdmin?: boolean;
  updateNotaStatus?: (id: string, status: string) => Promise<void>;
  statusLoading?: boolean;
  fetchNotas?: () => Promise<void>;
}
