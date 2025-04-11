export interface ChartItem {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis?: string;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  order?: number;
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

export interface ChartData {
  [key: string]: any;
}

export interface UploadProgressStats {
  processedRows: number;
  totalRows: number;
  newRows: number;
  updatedRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error' | 'empty';
  message?: string;
  estimatedTimeRemaining?: string;
}

export interface UploadStats {
  sgz?: UploadProgressStats;
  painel?: UploadProgressStats;
  lastRefreshed?: Date;
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
  responsavel?: string[];
}
