// OS156 Types
export interface OS156Item {
  id: string;
  numero_os: string;
  status: string;
  tipo_servico: string;
  logradouro: string;
  bairro: string;
  distrito: string;
  empresa: string;
  data_criacao: string;
  data_status: string;
  tempo_aberto: number;
  area_tecnica: 'STM' | 'STLP';
  servico_valido: boolean;
  upload_id?: string;
}

export interface OS156Upload {
  id: string;
  nome_arquivo: string;
  data_upload: string;
  processado: boolean;
}

export type OrderStatus = 'Todos' | 'NOVO' | 'AB' | 'PE' | 'CONC' | 'FECHADO' | 'PREPLAN' | 'PRECANC';
export type District = 'Todos' | 'PINHEIROS' | 'ALTO DE PINHEIROS' | 'JARDIM PAULISTA' | 'ITAIM BIBI' | 'EXTERNO';
export type AreaTecnica = 'Todos' | 'STM' | 'STLP';

export interface OS156FilterOptions {
  statuses: OrderStatus[];
  districts: District[];
  areaTecnica: AreaTecnica;
  empresa: string[];
  dataInicio: Date | null;
  dataFim: Date | null;
}

// Add other types as needed for charts
export interface OS156ChartData {
  statusDistribution: any;
  averageTimeByStatus: any;
  companiesPerformance: any;
  servicesByDistrict: any;
  servicesByTechnicalArea: any;
  efficiencyScore: any;
  timeToCompletion: any;
  dailyNewOrders: any;
  timeToClose: any;
  statusTimeline: any;
  servicesDiversity: any;
  externalDistrictsAnalysis: any;
  efficiencyRadar: any;
  criticalStatusAnalysis: any;
  frequentServices: any;
}

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

// Charts visibility configuration
export interface ChartVisibility {
  statusDistribution: boolean;
  resolutionTime: boolean;
  dailyOrders: boolean;
  timeToClose: boolean;
  neighborhoods: boolean;
  serviceTypes: boolean;
  efficiencyRadar: boolean;
  servicesDiversity: boolean;
  externalDistricts: boolean;
  statusTimeline: boolean;
  statusTransition: boolean;
  criticalStatus: boolean;
  frequentServices: boolean;
}
