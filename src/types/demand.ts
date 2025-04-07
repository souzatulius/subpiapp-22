
export interface DemandFormData {
  titulo: string;
  problema_id: string;
  origem_id: string;
  tipo_midia_id: string;
  prioridade: string;
  prazo_resposta: string;
  nome_solicitante: string;
  telefone_solicitante: string;
  email_solicitante: string;
  veiculo_imprensa: string;
  endereco: string;
  bairro_id: string;
  perguntas: string[];
  detalhes_solicitacao: string;
  arquivo_url: string;
  anexos: string[]; // Ensure this matches the TEXT[] type in the database
  tem_protocolo_156?: boolean;
  numero_protocolo_156?: string;
  servico_id?: string;
  nao_sabe_servico?: boolean;
}

export interface FormState {
  formData: DemandFormData;
  areasCoord: any[];
  origens: any[];
  tiposMidia: any[];
  distritos: any[];
  bairros: any[];
  problemas: any[];
  filteredBairros: any[];
  isLoading: boolean;
  serviceSearch: string;
  selectedDistrito: string;
  activeStep: number;
}

export interface Demand {
  id: string;
  titulo: string;
  status: string; // Valores atualizados: pendente, em_andamento, aguardando_nota, aguardando_aprovacao, concluida, concluida_editada, concluida_recusada, cancelada, arquivada
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  coordenacao_id?: string; // Added
  problema_id?: string; // Added
  supervisao_tecnica_id?: string; // Keep for backward compatibility
  supervisao_tecnica?: {
    id?: string;
    descricao: string;
  } | null;
  area_coordenacao: {
    id?: string;
    descricao: string;
  } | null;
  origem: {
    id?: string;
    descricao: string;
  } | null;
  tipo_midia: {
    id?: string;
    descricao: string;
  } | null;
  bairro: {
    id?: string;
    nome: string;
  } | null;
  autor: {
    id?: string;
    nome_completo: string;
  } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null | any;
  servico: {
    id?: string;
    descricao: string;
  } | null;
  arquivo_url: string | null;
  anexos: string[] | null;
  servico_id?: string;
  notas?: Note[] | null;
  comentarios?: Array<{
    texto: string;
    autor: string;
    data: string;
  }>;
  respostas?: Array<{
    id: string;
    texto: string;
  }>;
}

export interface DemandResponse {
  demanda_id: string;
  texto: string;
}

export interface ResponseQA {
  question: string;
  answer: string;
}

export interface CriarNotaFormProps {
  onClose: () => void;
}

export interface Note {
  id: string;
  demanda_id: string;
  titulo: string;
  autor_id: string;
  status?: string;
}
