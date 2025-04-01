
/**
 * Este arquivo contém especificações técnicas detalhadas sobre o formulário de cadastro de demandas
 * e serve como uma referência técnica para desenvolvedores.
 */

import { DemandFormData } from '@/hooks/demandForm';

/**
 * Configuração das etapas do formulário de cadastro de demandas
 */
export const FORM_STEPS_CONFIG = [
  {
    id: 0,
    title: "Origem e prazo da demanda",
    description: "",
    requiredFields: ["origem_id", "prazo_resposta"]
  },
  {
    id: 1,
    title: "Dados do solicitante e mídia",
    description: "",
    requiredFields: ["tipo_midia_id", "nome_solicitante", "telefone_solicitante", "email_solicitante"]
  },
  {
    id: 2,
    title: "Tema, serviço e localização",
    description: "",
    requiredFields: ["problema_id", "detalhes_solicitacao", "bairro_id"]
  },
  {
    id: 3,
    title: "Título, perguntas e anexos",
    description: "",
    requiredFields: ["titulo"]
  },
  {
    id: 4,
    title: "Revise tudo antes de enviar",
    description: "",
    // Na etapa de revisão, todos os campos obrigatórios são validados
    requiredFields: [
      "titulo", "problema_id", "origem_id", "prazo_resposta", 
      "nome_solicitante", "email_solicitante", "bairro_id", "detalhes_solicitacao"
    ]
  }
];

/**
 * Mapeamento dos campos do formulário para nomes amigáveis exibidos nas mensagens de erro
 */
export const FIELD_FRIENDLY_NAMES: Record<keyof DemandFormData | string, string> = {
  titulo: "Título da Demanda",
  problema_id: "Tema",
  origem_id: "Origem da Demanda",
  tipo_midia_id: "Tipo de Mídia",
  prioridade: "Prioridade",
  prazo_resposta: "Prazo para Resposta",
  nome_solicitante: "Nome do Solicitante",
  telefone_solicitante: "Telefone do Solicitante",
  email_solicitante: "Email do Solicitante",
  veiculo_imprensa: "Veículo de Imprensa",
  endereco: "Endereço",
  bairro_id: "Bairro",
  detalhes_solicitacao: "Detalhes da Solicitação",
  numero_protocolo_156: "Número do Protocolo",
  servico_id: "Serviço"
};

/**
 * Tipos de arquivos aceitos para upload
 */
export const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/heic',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

/**
 * Limite máximo de tamanho de arquivo para upload (em MB)
 */
export const MAX_FILE_SIZE_MB = 10;

/**
 * Especificação dos tipos de dados externos usados pelo formulário
 */
export interface ExternalDataTypes {
  /**
   * Áreas de coordenação disponíveis
   */
  areasCoord: {
    id: string;
    descricao: string;
    sigla?: string;
  }[];

  /**
   * Origens de demanda disponíveis
   */
  origens: {
    id: string;
    descricao: string;
    icone?: string;
  }[];

  /**
   * Tipos de mídia disponíveis
   */
  tiposMidia: {
    id: string;
    descricao: string;
    icone?: string;
  }[];

  /**
   * Distritos disponíveis
   */
  distritos: {
    id: string;
    nome: string;
  }[];

  /**
   * Bairros disponíveis
   */
  bairros: {
    id: string;
    nome: string;
    distrito_id: string;
  }[];

  /**
   * Problemas/temas disponíveis
   */
  problemas: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
    supervisao_tecnica_id?: string;
    supervisao_tecnica?: {
      id?: string;
      descricao: string;
    } | null;
    icone?: string;
  }[];

  /**
   * Serviços disponíveis
   */
  servicos: {
    id: string;
    descricao: string;
    problema_id: string;
  }[];
}

/**
 * Estrutura do banco de dados para demandas
 */
export interface DemandDatabaseSchema {
  /**
   * Tabela principal de demandas
   */
  demandas: {
    id: string; // UUID gerado pelo backend
    titulo: string;
    problema_id: string;
    origem_id: string;
    tipo_midia_id: string | null;
    prioridade: string;
    prazo_resposta: string;
    nome_solicitante: string | null;
    telefone_solicitante: string | null;
    email_solicitante: string | null;
    veiculo_imprensa: string | null;
    endereco: string | null;
    bairro_id: string | null;
    perguntas: Record<string, string> | null; // Formato JSON
    detalhes_solicitacao: string | null;
    arquivo_url: string | null;
    anexos: string[] | null; // Array de URLs
    servico_id: string | null;
    nao_sabe_servico: boolean;
    autor_id: string; // UUID do usuário logado
    status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
    horario_publicacao: string; // Timestamp
    atualizado_em: string; // Timestamp
    coordenacao_id: string | null;
  };
}

/**
 * Fluxo técnico de submissão de formulário
 */
export const FORM_SUBMISSION_FLOW = {
  /**
   * Etapa 1: Validação de campos
   */
  validation: {
    description: 'Validação de todos os campos obrigatórios',
    function: 'validateDemandForm() em lib/formValidationUtils.ts'
  },
  
  /**
   * Etapa 2: Formatação de dados
   */
  formatting: {
    description: 'Formatação de dados como perguntas (para JSON)',
    function: 'formatQuestionsToObject() em utils/questionFormatUtils.ts'
  },
  
  /**
   * Etapa 3: Validação de URLs de anexos
   */
  urlValidation: {
    description: 'Validação de URLs de arquivos anexados',
    function: 'isValidPublicUrl() em utils/questionFormatUtils.ts'
  },
  
  /**
   * Etapa 4: Preparação do payload
   */
  payloadPreparation: {
    description: 'Preparação dos dados para envio à API',
    location: 'useDemandFormSubmit.ts'
  },
  
  /**
   * Etapa 5: Submissão à API
   */
  apiSubmission: {
    description: 'Envio dos dados para o Supabase',
    function: 'supabase.from("demandas").insert(payload)'
  },
  
  /**
   * Etapa 6: Tratamento de sucesso
   */
  successHandling: {
    description: 'Exibição de toast de sucesso e reset do formulário',
    functions: [
      'toast({title: "Demanda cadastrada com sucesso!"})',
      'resetForm()',
      'onClose()'
    ]
  },
  
  /**
   * Etapa 7: Tratamento de erro
   */
  errorHandling: {
    description: 'Exibição de toast de erro com detalhes',
    location: 'catch block em useDemandFormSubmit.ts'
  }
};
