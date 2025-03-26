
export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  autor_id: string;
  autor: {
    id: string;
    nome_completo: string;
  };
  aprovador_id?: string;
  aprovador?: {
    id: string;
    nome_completo: string;
  } | null;
  supervisao_tecnica_id: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
  } | null;
  area_coordenacao: {
    id: string;
    descricao: string;
  };
  demanda_id?: string;
  problema_id: string;
  historico_edicoes?: NotaEdicao[];
}

export interface NotaEdicao {
  id: string;
  nota_id: string;
  texto_anterior: string;
  texto_novo: string;
  titulo_anterior?: string;
  titulo_novo?: string;
  editor_id: string;
  editor?: {
    id: string;
    nome_completo: string;
  } | null;
  criado_em: string;
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
