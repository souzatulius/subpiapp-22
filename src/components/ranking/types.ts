
import { DateRange } from 'react-day-picker';

export type OrderStatus = 'PREPLAN' | 'PRECANC' | 'Concluído' | 'Aprovado' | 'Em Andamento' | 'Todos';
export type ServiceType = 'Tapa-buraco' | 'Poda de árvore' | 'Recapeamento' | 'Limpeza de boca de lobo' | 'Manutenção de calçada' | 'Todos';
export type District = 'Itaim Bibi' | 'Pinheiros' | 'Alto de Pinheiros' | 'Jardim Paulista' | 'Todos';

export interface ChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  frequentServices: boolean;
  statusDistribution: boolean;
  topCompanies: boolean;
  criticalStatus: boolean;
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
