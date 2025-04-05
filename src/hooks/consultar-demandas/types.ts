
export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: {
    id?: string;
    descricao: string;
  } | null;
  servico: {
    descricao: string;
  } | null;
  origem: {
    descricao: string;
  } | null;
  tipo_midia: {
    descricao: string;
  } | null;
  bairro: {
    id?: string;
    nome: string;
  } | null;
  autor: {
    nome_completo: string;
  } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
  problema_id?: string;
  problema?: {
    id: string;
    descricao: string;
    supervisao_tecnica?: {
      id: string;
      descricao: string;
      coordenacao_id?: string;
    } | null;
    coordenacao?: {
      id: string;
      descricao: string;
    } | null;
  } | null;
  supervisao_tecnica_id?: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  } | null;
  arquivo_url: string | null; 
  anexos: string[] | null; 
  resposta?: {
    id: string;
    demanda_id: string;
    texto: string;
    respostas: Record<string, string> | null;
    usuario_id: string;
    criado_em: string;
    comentarios: string | null;
  } | null;
}

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
  error: Error | null;
  refetch: () => Promise<any>;
  handleDeleteConfirm: () => Promise<void>;
}
