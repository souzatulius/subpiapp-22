
export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  autor_id: string;
  autor?: {
    id: string;
    nome_completo: string;
  };
  aprovador_id?: string;
  aprovador?: {
    id: string;
    nome_completo: string;
  };
  area_coordenacao_id: string;
  area_coordenacao?: {
    id: string;
    descricao: string;
  };
  demanda_id?: string;
}

export interface UseNotasDataReturn {
  notas: NotaOficial[];
  filteredNotas: NotaOficial[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  dataInicioFilter: Date | undefined;
  setDataInicioFilter: (date: Date | undefined) => void;
  dataFimFilter: Date | undefined;
  setDataFimFilter: (date: Date | undefined) => void;
  formatDate: (dateStr: string) => string;
  refetch: () => Promise<any>;
  deleteNota: (notaId: string) => Promise<void>;
  deleteLoading: boolean;
  isAdmin: boolean;
}
