
export interface Demand {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'respondida' | 'aprovada' | 'recusada' | string;
  urgente?: boolean;
  dataCriacao?: string;
  dataResposta?: string;
  origem?: string;
  tema?: string;
  servico?: {
    id?: string;
    descricao: string | null;
  } | null;
  area?: string;
  protocolo?: string;
  requesterName?: string;
  requesterOrg?: string;
  
  // Additional properties needed by criar-nota components
  prioridade?: string;
  horario_publicacao?: string;
  prazo_resposta?: string;
  endereco?: string | null;
  nome_solicitante?: string | null;
  email_solicitante?: string | null;
  cep?: string | null;
  numero?: string | null;
  referencia?: string | null;
  bairro_id?: string | null;
  problema_id?: string | null;
  coordenacao_id?: string | null;
  supervisao_tecnica_id?: string | null;
  tema_id?: string | null;
  servico_id?: string | null;
  area_coordenacao?: {
    descricao: string;
    id?: string;
  } | null;
  
  // Properties for useDemandasData
  tipo_midia?: string | any;
  bairro?: string | any;
  autor?: string | any;
  telefone_solicitante?: string;
  foto?: string;
  regiao?: string;
  foto_url?: string;
  notas?: Note[];
  
  // Properties needed by criar-nota
  veiculo_imprensa?: string;
  detalhes_solicitacao?: string;
  resumo_situacao?: string;
  perguntas?: any;
  arquivo_url?: string;
  tipo_veiculo?: string;
  supervisao_tecnica?: any;
  comentarios?: string;
  
  // Missing properties causing TypeScript errors
  anexos?: string[] | null;
  problema?: {
    descricao: string | null;
    id?: string;
    coordenacao?: {
      id?: string;
      descricao: string;
      sigla?: string;
    } | null;
  } | null;
  
  // Additional properties from other interfaces
  origem_id?: string | any;
  tipo_midia_id?: any;
  
  // Fix for coordenacao property
  coordenacao?: {
    id?: string;
    descricao: string;
    sigla?: string;
  } | null;
  
  bairros?: {
    nome: string;
    id?: string;
  } | null;
}

export interface Note {
  id: string;
  titulo: string;
  conteudo: string;
  status: string;
  data_criacao: string;
  autor_id: string;
  demanda_id?: string;
}

export interface ResponseQA {
  question: string;
  answer: string;
}
