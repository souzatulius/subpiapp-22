
export interface ChartVisibility {
  districtPerformance: boolean;
  serviceTypes: boolean;
  resolutionTime: boolean;
  responsibility: boolean;
  evolution: boolean;
  departmentComparison: boolean;
  oldestPendingList: boolean;
}

export interface FilterOptions {
  dataInicio?: string;
  dataFim?: string;
  status?: string[];
  distritos?: string[];
  tiposServico?: string[];
  departamento?: string[];
}

export interface ChartFilter extends FilterOptions {
  showSimulation?: boolean;
}
