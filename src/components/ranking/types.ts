
import { DateRange } from 'react-day-picker';

export type OrderStatus = 'PREPLAN' | 'PRECANC' | 'Concluído' | 'Aprovado' | 'Em Andamento' | 'Todos';
export type ServiceType = 'Tapa-buraco' | 'Poda de árvore' | 'Recapeamento' | 'Limpeza de boca de lobo' | 'Manutenção de calçada' | 'Todos';
export type District = 'Itaim Bibi' | 'Pinheiros' | 'Alto de Pinheiros' | 'Jardim Paulista' | 'Todos';

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
