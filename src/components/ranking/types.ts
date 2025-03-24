
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
  area_tecnica: 'STM' | 'STLP' | '';
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
  dateRange?: { from: Date; to: Date }; // Added for compatibility
}

// For backward compatibility with the ranking and filters
export type FilterOptions = {
  dateRange?: { from: Date; to: Date };
  statuses: string[];
  serviceTypes: string[];
  districts: string[];
};

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
  statusTransition?: any; // Added for compatibility
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
  occurrences?: boolean; // Added for compatibility
}

// For ranking data compatibility
export interface OrdemServico {
  id: string;
  ordem_servico: string;
  classificacao_servico: string;
  status: string;
  criado_em: string;
  data_status: string;
  distrito: string;
  bairro?: string;
  logradouro?: string;
  fornecedor?: string;
  area_tecnica?: string;
  dias_ate_status_atual?: number;
  planilha_referencia?: string;
}

export interface PlanilhaUpload {
  id: string;
  arquivo_nome: string;
  data_upload: string;
  usuario_upload: string;
  qtd_ordens_processadas: number;
  qtd_ordens_validas: number;
  status_upload: "sucesso" | "erro" | "parcial";
}

export interface StatusHistorico {
  id: string;
  ordem_servico: string;
  status_antigo: string;
  status_novo: string;
  data_mudanca: string;
  planilha_origem?: string;
}
