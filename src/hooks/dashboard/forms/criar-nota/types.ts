
import { Note } from '@/types/demand';

export interface Demand {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'respondida' | 'aprovada' | 'recusada' | string;
  urgente?: boolean;
  dataCriacao?: string;
  dataResposta?: string;
  origem?: string;
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
  
  // Related entities as complex objects
  tema?: {
    descricao?: string;
    id?: string;
    coordenacao?: {
      descricao?: string;
      id?: string;
      sigla?: string;
    }
  } | string; // Allow both string and object
  
  servico?: {
    descricao?: string;
    id?: string;
  } | string; // Allow both string and object
  
  numero_protocolo_156?: string; // Added for protocol 156 access
}

export interface ResponseQA {
  question: string;
  answer: string;
}
