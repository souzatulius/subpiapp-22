export interface ChartConfig {
  id: string;
  title: string;
  subtitle?: string;
  value?: string | number;
  component: string;
}

export interface ChartVisibility {
  // Performance & Efficiency charts
  statusDistribution: boolean;
  statusTransition: boolean;
  districtEfficiencyRadar: boolean;
  resolutionTime: boolean;
  
  // Territories & Services charts
  districtPerformance: boolean;
  serviceTypes: boolean;
  
  // Critical Flows charts
  responsibility: boolean;
  sgzPainel: boolean;
  oldestPendingList: boolean;
  
  // Keeping other chart visibility flags for backward compatibility
  evolution: boolean;
  departmentComparison: boolean;
  topCompanies: boolean;
  districtDistribution: boolean;
  servicesByDepartment: boolean;
  servicesByDistrict: boolean;
  timeComparison: boolean;
  dailyDemands: boolean;
  closureTime: boolean;
  neighborhoodComparison: boolean;
  externalDistricts: boolean;
  efficiencyImpact: boolean;
  criticalStatus: boolean;
  serviceDiversity: boolean;
  
  // Index signature to allow any string key
  [key: string]: boolean;
}

export interface FilterOptions {
  dateRange?: { from: Date | null; to: Date | null };
  status?: string[];
  serviceTypes?: string[];
  distritos?: string[];
  dataInicio?: string;
  dataFim?: string;
  tiposServico?: string[];
  departamento?: string[];
  responsavel?: string[]; // Added to filter by responsibility
}

export interface ChartItem {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis?: string;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  subtitle?: string;
  type?: string;
}

export interface ProcessingStats {
  newOrders?: number;
  updatedOrders?: number;
  processingStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  totalRecords?: number;
  recordCount?: number;
  message?: string;
  totalRows?: number; // Added for better progress tracking
  totalServiceOrders?: number;
}

export interface UploadResult {
  success: boolean;
  recordCount: number;
  message: string;
  id?: string;
  data?: any[];
  newOrders?: number;
  updatedOrders?: number;
  totalRecords?: number;
}

export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  estimatedTimeRemaining?: string;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

export interface UploadStats {
  sgz?: UploadProgressStats;
  painel?: UploadProgressStats;
  lastRefreshed?: Date;
}
