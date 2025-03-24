import { DateRange } from 'react-day-picker';

export type OrderStatus = 'Planejar' | 'Novo' | 'Aprovado' | 'Concluído' | 'Todos' | 'NOVO' | 'CONC' | 'PREPLAN' | 'PRECANC' | 'AB' | 'PE' | 'FECHADO';
export type ServiceType = 'Tapa Buraco' | 'Poda' | 'Limpeza' | 'Todos';
export type District = 'Itaim Bibi' | 'Pinheiros' | 'Alto de Pinheiros' | 'Jardim Paulista' | 'Todos' | 'PINHEIROS' | 'ALTO DE PINHEIROS' | 'JARDIM PAULISTA' | 'ITAIM BIBI' | 'EXTERNO';

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

export interface FilterOptions {
  dateRange: DateRange | undefined;
  statuses: OrderStatus[];
  serviceTypes: ServiceType[];
  districts: District[];
}

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

export interface OS156Item {
  id: string;
  numero_os: string;
  distrito: string;
  bairro: string;
  logradouro?: string;
  tipo_servico: string;
  area_tecnica: 'STM' | 'STLP';
  empresa?: string;
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

export interface OS156FilterOptions extends FilterOptions {
  areaTecnica: 'Todos' | 'STM' | 'STLP';
  empresa: string[];
  dataInicio?: Date;
  dataFim?: Date;
}
