
import { DateRange } from 'react-day-picker';

export type OrderStatus = 'Planejar' | 'Novo' | 'Aprovado' | 'Concluído' | 'Todos';
export type ServiceType = 'Tapa Buraco' | 'Poda' | 'Limpeza' | 'Todos';
export type District = 'Itaim Bibi' | 'Pinheiros' | 'Alto de Pinheiros' | 'Jardim Paulista' | 'Todos';

export interface ChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  frequentServices: boolean;
  statusDistribution: boolean;
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
