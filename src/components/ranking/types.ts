
export interface FilterOptions {
  dateRange?: { from: Date; to: Date } | undefined;
  statuses: string[];
  serviceTypes: string[];
  districts: string[];
}

export interface ChartFilter {
  dataInicio?: Date;
  dataFim?: Date;
  distritos?: string[];
  tiposServico?: string[];
  status?: string[];
}

export interface ChartVisibility {
  statusDistribution: boolean;
  resolutionTime: boolean;
  topCompanies: boolean;
  districtDistribution: boolean;
  servicesByDepartment: boolean;
  servicesByDistrict: boolean;
  timeComparison: boolean;
  efficiencyImpact: boolean;
  dailyDemands: boolean;
  neighborhoodComparison: boolean;
  districtEfficiencyRadar: boolean;
  statusTransition: boolean;
  criticalStatus: boolean;
  externalDistricts: boolean;
  serviceDiversity: boolean;
  closureTime: boolean;
  responsibility: boolean;
  evolution: boolean;
  departmentComparison: boolean;
  serviceTypes: boolean;
  districtPerformance: boolean;
  oldestPendingList: boolean;
}
