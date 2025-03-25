
import { DateRange } from 'react-day-picker';

export interface SGZFilterOptions {
  dateRange: DateRange | undefined;
  dataDe?: Date | null; // Added for compatibility
  dataAte?: Date | null; // Added for compatibility
  statuses: string[];
  serviceTypes: string[];
  districts: string[];
  areas: string[];
}

export interface SGZChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  areas: boolean;
  statusDistribution: boolean;
}

export interface SGZUploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

export interface SGZOrdemServico {
  id: string;
  ordem_servico: string;
  sgz_criado_em: string;
  sgz_status: string;
  sgz_classificacao_servico: string;
  sgz_distrito: string | null;
  sgz_bairro: string | null;
  sgz_area_tecnica: string;
  sgz_data_status: string;
  sgz_dias_ate_status_atual: number | null;
  prioridade?: string; // Made optional
}
