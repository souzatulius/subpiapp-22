export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  autor_id: string;
  autor?: {
    id: string;
    nome_completo: string;
  } | null;
  aprovador_id?: string;
  aprovador?: {
    id: string;
    nome_completo: string;
  } | null;
  problema_id: string;
  problema?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
    coordenacao?: {
      id: string;
      descricao: string;
    } | null;
  } | null;
  supervisao_tecnica_id?: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
  } | null;
  demanda_id?: string;
  demanda?: {
    id: string;
    titulo: string;
  } | null;
  criado_em: string;
  atualizado_em?: string;
  created_at?: string; // For backward compatibility
  updated_at?: string; // For backward compatibility
  historico_edicoes?: NotaEdicao[];
  area_coordenacao?: {
    id: string;
    descricao: string;
  } | null;
}

export interface NotaEdicao {
  id: string;
  nota_id: string;
  editor_id: string;
  editor?: {
    id: string;
    nome_completo: string;
  } | null;
  texto_anterior: string;
  texto_novo: string;
  titulo_anterior: string;
  titulo_novo: string;
  criado_em: string;
}

export interface UseNotasDataReturn {
  notas: NotaOficial[] | null;
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
  deleteNota: (id: string) => Promise<void>;
  deleteLoading: boolean;
  isAdmin: boolean;
}
