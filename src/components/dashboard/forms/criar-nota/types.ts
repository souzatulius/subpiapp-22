
export interface Demand {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'respondida' | 'aprovada' | 'recusada' | string;
  urgente?: boolean;
  dataCriacao?: string;
  dataResposta?: string;
  origem_id?: string;
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
  telefone_solicitante?: string | null;
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
  tipo_midia_id?: string | any;
  tipo_midia?: {
    id?: string;
    descricao: string | null;
  } | null;
  bairro?: string | any;
  foto?: string;
  regiao?: string;
  foto_url?: string;
  notas?: Note[];
  
  // Properties needed by criar-nota
  veiculo_imprensa?: string;
  detalhes_solicitacao?: string;
  resumo_situacao?: string;
  perguntas?: Record<string, string> | null | any;
  arquivo_url?: string;
  anexos?: string[] | null;
  comentarios?: string | null;
  
  // Fix for problema property
  problema?: {
    id?: string;
    descricao: string | null;
    coordenacao?: {
      id?: string;
      descricao: string;
      sigla?: string;
    } | null;
  } | null;
  
  // Fix for coordenacao property
  coordenacao?: {
    id?: string;
    descricao: string;
    sigla?: string;
  } | null;
  
  bairros?: {
    id?: string;
    nome: string;
    distritos?: {
      id?: string;
      nome: string;
    } | null;
  } | null;
  
  // Fix for origem property
  origem?: {
    id?: string;
    descricao: string;
  } | null;
  
  // Add autor property
  autor_id?: string | null;
  autor?: {
    id?: string;
    nome_completo: string;
  } | null;
  
  // Add resposta property
  resposta?: {
    respostas?: Record<string, string> | null;
    texto?: string;
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
