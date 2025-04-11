
export interface ChartItem {
  id: string;
  title: string;
  component: React.ReactNode;
  analysis?: string;
  order: number;
  visible: boolean;
  description?: string;
  isVisible?: boolean; // For backward compatibility
  isAnalysisExpanded?: boolean;
  showAnalysisOnly?: boolean;
  subtitle?: string;
  type?: string;
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

export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
  estimatedTimeRemaining?: string;
}

export interface UploadStats {
  sgz?: UploadProgressStats;
  painel?: UploadProgressStats;
  lastRefreshed?: Date;
}

export interface ProcessingStats {
  newOrders?: number;
  updatedOrders?: number;
  processingStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  totalRows?: number;
  message?: string;
  totalServiceOrders?: number;
  totalRecords?: number;
  recordCount?: number;
}
