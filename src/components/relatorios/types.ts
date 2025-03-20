
import { DateRange } from "react-day-picker";

export interface FilterOptions {
  dateRange: DateRange | undefined;
  statuses: string[];
  serviceTypes: string[];
  districts: string[];
  origins: string[];
  mediaTypes: string[];
  coordinationAreas: string[];
}

export interface ChartVisibility {
  districtDistribution: boolean;
  neighborhoodDistribution: boolean;
  demandOrigin: boolean;
  mediaTypes: boolean;
  responseTime: boolean;
  serviceTypes: boolean;
  coordinationAreas: boolean;
  statusDistribution: boolean;
  responsibleUsers: boolean;
  noteApprovals: boolean;
}
