
import { ReactNode } from 'react';

export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  prazo_resposta?: string;
  perguntas?: string[] | Record<string, string> | null;
  detalhes_solicitacao?: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
  } | null;
  origens_demandas?: {
    descricao: string;
  } | null;
  tipos_midia?: {
    descricao: string;
  } | null;
  servicos?: {
    descricao: string;
  } | null;
  arquivo_url?: string;
  arquivo_nome?: string;
}

export interface Area {
  id: string;
  descricao: string;
}

export interface ResponderDemandaFormProps {
  onClose: () => void;
}

export type ViewMode = 'list' | 'cards';

export interface ChartCard {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

export interface FilterOptions {
  dateRange?: {
    from: Date | string | null;
    to: Date | string | null;
  };
  statuses: string[];
  districts: string[];
  serviceTypes: string[];
  areas?: AreaTecnica[];
  companies?: string[];
}

export type OrderStatus = string;
export type District = string;
export type AreaTecnica = 'Todos' | 'STM' | 'STLP' | string;
export type ChartVisibility = Record<string, boolean>;

export interface OS156Item {
  id: string;
  numero_os: string;
  distrito: string;
  bairro: string;
  logradouro: string;
  tipo_servico: string;
  area_tecnica: "STM" | "STLP" | "";
  empresa: string;
  data_criacao: string;
  status: string;
  data_status: string;
  tempo_aberto: number;
  servico_valido: boolean;
  upload_id?: string;
}

export interface OS156Upload {
  id: string;
  nome_arquivo: string;
  data_upload: string;
  processado: boolean;
}

export interface PlanilhaUpload {
  id: string;
  arquivo_nome: string;
  data_upload: string;
  usuario_upload: string;
  qtd_ordens_processadas?: number;
  qtd_ordens_validas?: number;
  status_upload: "sucesso" | "erro" | "parcial";
}

export interface OrdemServico {
  id: string;
  ordem_servico: string;
  distrito: string;
  bairro: string | null;
  logradouro: string | null;
  classificacao_servico: string;
  fornecedor: string;
  area_tecnica: string;
  criado_em: string;
  status: string;
  data_status: string;
  dias_ate_status_atual: number | null;
  planilha_referencia: string;
}

export interface StatusHistorico {
  id: string;
  ordem_servico_id: string;
  status: string;
  data_status: string;
  dias_no_status: number;
  criado_em: string;
}

export interface ChartData {
  statusDistribution?: any[];
  resolutionTime?: any[];
  dailyOrders?: any[];
  companiesPerformance?: any[];
  timeToClose?: any[];
  efficiencyScore?: any[];
  serviceTypes?: any[];
  districtsData?: any[];
  neighborhoodsData?: any[];
}
