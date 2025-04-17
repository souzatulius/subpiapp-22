
export interface Demanda {
  id: string;
  titulo: string;
  detalhes_solicitacao?: string | null;
  resumo_situacao?: string | null;
  prazo_resposta?: string | null;
  prioridade: string;
  perguntas?: Record<string, string> | null;
  status: string;
  horario_publicacao: string;
  endereco?: string | null;
  nome_solicitante?: string | null;
  email_solicitante?: string | null;
  telefone_solicitante?: string | null;
  veiculo_imprensa?: string | null;
  arquivo_url?: string | null;
  anexos?: string[];
  coordenacao_id?: string | null;
  coordenacao?: {
    id?: string;
    descricao: string;
    sigla?: string;
  } | null;
  supervisao_tecnica_id?: string | null;
  bairro_id?: string | null;
  autor_id?: string | null;
  tipo_midia_id?: string | null;
  origem_id?: string | null;
  problema_id?: string | null;
  servico_id?: string | null;
  protocolo?: string | null;
  tema?: {
    id: string;
    descricao: string;
    icone?: string | null;
    coordenacao?: {
      id?: string;
      descricao: string;
      sigla?: string;
    } | null;
  } | null;
  areas_coordenacao?: any;
  origens_demandas?: {
    id: string;
    descricao: string;
  } | null;
  tipos_midia?: {
    id: string; 
    descricao: string;
  } | null;
  bairros?: {
    id: string;
    nome: string;
    distritos?: {
      id: string;
      nome: string;
    } | null;
  } | null;
  distrito?: {
    id: string;
    nome: string;
  } | null;
  autor?: {
    id: string;
    nome_completo: string;
  } | null;
  servico?: {
    id?: string;
    descricao: string;
  } | null;
  problema?: {
    id?: string;
    descricao?: string;
    coordenacao?: {
      id?: string;
      descricao?: string;
      sigla?: string;
    } | null;
  } | null;
  tipo_midia?: {
    id: string;
    descricao: string;
  } | null;
}

// Adding missing types
export type ViewMode = "list" | "cards";

export interface Area {
  id: string;
  descricao: string;
  sigla?: string;
}
