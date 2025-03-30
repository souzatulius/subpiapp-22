
export interface ChartVisibility {
  districtPerformance: boolean;
  serviceTypes: boolean;
  resolutionTime: boolean;
  responsibility: boolean;
  evolution: boolean;
  departmentComparison: boolean;
  oldestPendingList: boolean;
  statusDistribution: boolean;
  topCompanies: boolean;
  districtDistribution: boolean;
  servicesByDepartment: boolean;
  servicesByDistrict: boolean;
  timeComparison: boolean;
  dailyDemands: boolean;
  statusTransition: boolean;
  closureTime: boolean;
  neighborhoodComparison: boolean;
  districtEfficiencyRadar: boolean;
  externalDistricts: boolean;
  efficiencyImpact: boolean;
  criticalStatus: boolean;
  serviceDiversity: boolean;
}

export interface FilterOptions {
  dataInicio?: string;
  dataFim?: string;
  status?: string[];
  distritos?: string[];
  tiposServico?: string[];
  departamento?: string[];
  dateRange?: any;
  serviceTypes?: string[];
}

export interface ChartFilter extends FilterOptions {
  showSimulation?: boolean;
}

export interface ChartItem {
  id: string;
  title: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis: string;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
}
