import { DateRange } from 'react-day-picker';

export type OrderStatus = 'Planejar' | 'Novo' | 'Aprovado' | 'Concluído' | 'Todos';
export type ServiceType = 'Tapa Buraco' | 'Poda' | 'Limpeza' | 'Todos';
export type District = 'Itaim Bibi' | 'Pinheiros' | 'Alto de Pinheiros' | 'Jardim Paulista' | 'Todos';

export interface ChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  frequentServices: boolean;
  statusDistribution: boolean;
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

// Types for OS 156 data
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
}

// Extended filter options for OS156
export interface OS156FilterOptions extends FilterOptions {
  areaTecnica: 'Todos' | 'STM' | 'STLP';
  empresa: string[];
  dataInicio?: Date;
  dataFim?: Date;
}
