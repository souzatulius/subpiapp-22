export interface Demand {
  id: string;
  title?: string;
  descricao?: string;
  status: 'pendente' | 'respondida' | 'aprovada' | 'recusada' | string;
  urgente?: boolean;
  dataCriacao?: string;
  dataResposta?: string;
  origem?: string;
  tema?: string;
  servico?: string;
  area?: string;
  protocolo?: string;
  requesterName?: string;
  requesterOrg?: string;
  
  // Additional properties needed by criar-nota components
  titulo: string;
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
  
  // Properties from other interfaces
  anexos?: string[] | null;
  problema?: {
    descricao: string | null;
    id?: string;
    coordenacao?: any;
  } | null;
  
  // Additional properties 
  origem_id?: string | any;
  tipo_midia_id?: any;
  origens_demandas?: {
    descricao: string;
    id?: string;
  } | null;
  distrito?: {
    nome: string;
    id?: string;
  } | null;
  bairros?: {
    nome: string;
    id?: string;
    distritos?: {
      nome: string;
      id?: string;
    } | null;
  } | null;
  
  // Fix for coordenacao property - ensuring it has the required structure
  coordenacao?: {
    id?: string;
    descricao: string;
    sigla?: string;
  } | null;
  
  numero_protocolo_156?: string;
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

export interface CriarNotaFormProps {
  demandaId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}
