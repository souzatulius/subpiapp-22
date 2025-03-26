
export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  autor?: {
    id?: string;
    nome_completo?: string;
  };
  area_coordenacao?: {
    id?: string;
    descricao?: string;
  };
  demanda?: {
    id?: string;
    titulo?: string;
  };
  supervisao_tecnica?: {
    id?: string;
    descricao?: string;
  };
  status: string;
  created_at: string;
  updated_at?: string;
  problema?: {
    id?: string;
    descricao?: string;
  };
  revisado_por?: {
    id?: string;
    nome_completo?: string;
  };
  revisado_em?: string;
  
  // Campos adicionais necessários para a aplicação
  criado_em: string;        // Duplicado de created_at para compatibilidade
  atualizado_em?: string;   // Duplicado de updated_at para compatibilidade
  demanda_id?: string;      // ID direto da demanda para facilitar relações
  aprovador?: {
    id?: string;
    nome_completo?: string;
  };
  historico_edicoes?: Array<{
    id: string;
    criado_em: string;
    editor?: {
      nome_completo?: string;
    };
    titulo_anterior: string;
    titulo_novo: string;
    texto_anterior: string;
    texto_novo: string;
  }>;
}

// Interface para dados de retorno do hook useNotasData
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
  deleteNota: (notaId: string) => Promise<void>;
  deleteLoading: boolean;
  isAdmin: boolean;
}

// Interface para histórico de edição de notas
export interface NotaEdicao {
  id: string;
  nota_id: string;
  editor_id: string;
  criado_em: string;
  texto_anterior: string;
  texto_novo: string;
  titulo_anterior: string;
  titulo_novo: string;
  editor?: {
    id?: string;
    nome_completo?: string;
  };
}
