
export type OrderStatus = 'Todos' | 'NOVO' | 'AB' | 'PE' | 'APROVADO' | 'PREPLAN' | 'PRECANC' | 'EMAND' | 'CONC' | 'FECHADO';
export type District = 'Todos' | 'PINHEIROS' | 'ALTO DE PINHEIROS' | 'JARDIM PAULISTA' | 'ITAIM BIBI' | 'EXTERNO';
export type ServiceType = string;
export type TechnicalArea = 'STM' | 'STLP' | '';
export type AreaTecnica = 'Todos' | 'STM' | 'STLP';

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface FilterOptions {
  dateRange?: DateRange;
  statuses: OrderStatus[];
  serviceTypes: ServiceType[];
  districts: District[];
  companies: string[];
  areas: AreaTecnica[];
}

// Add OS156 specific types
export interface OS156FilterOptions extends FilterOptions {
  dataInicio?: Date;
  dataFim?: Date;
}

export interface ChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  frequentServices: boolean;
  statusDistribution: boolean;
  statusTimeline: boolean;
  statusTransition: boolean;
  efficiencyRadar: boolean;
  criticalStatus: boolean;
  externalDistricts: boolean;
  servicesDiversity: boolean;
  timeToClose: boolean;
  dailyOrders: boolean;
}

export interface OS156Item {
  id: string;
  numero_os: string;
  distrito: string;
  bairro: string;
  logradouro: string;
  tipo_servico: string;
  area_tecnica: TechnicalArea;
  empresa: string;
  data_criacao: string;
  status: string;
  data_status: string;
  tempo_aberto: number;
  servico_valido: boolean;
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
  qtd_ordens_processadas: number;
  qtd_ordens_validas: number;
  status_upload: 'sucesso' | 'erro' | 'parcial';
}

export interface OrdemServico {
  id: string;
  ordem_servico: string;
  classificacao_servico: string;
  contrato?: string;
  fornecedor?: string;
  criado_em: string;
  status: string;
  data_status: string;
  prioridade?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  distrito: string;
  cep?: string;
  area_tecnica: string;
  dias_ate_status_atual?: number;
}

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

export interface StatusHistorico {
  id: string;
  ordem_servico: string;
  status_antigo?: string;
  status_novo: string;
  data_mudanca: string;
}

export interface ChartCard {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

// Define the structure for chart data
export interface OS156ChartData {
  statusDistribution: any;
  averageTimeByStatus: any;
  companiesPerformance: any;
  servicesByTechnicalArea: any;
  servicesByDistrict: any;
  timeToCompletion: any;
  efficiencyScore: any;
  dailyNewOrders: any;
  servicesDiversity: any;
  statusTimeline: any;
  statusTransition: any;
  efficiencyRadar: any;
  criticalStatusAnalysis: any;
  externalDistrictsAnalysis: any;
  timeToClose: any;
}
