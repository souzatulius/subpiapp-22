
export interface ChartConfig {
  id: string;
  title: string;
  subtitle?: string;
  value?: string | number;
  component: React.ReactNode;
}

export interface ChartVisibility {
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
}
