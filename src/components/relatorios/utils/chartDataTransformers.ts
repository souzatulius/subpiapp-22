
import { ChartDataItem } from '../hooks/reports/types';

// Transform district data to pie chart format
export const transformDistrictsToPieData = (districts: ChartDataItem[]) => {
  return districts.map(district => ({
    name: district.name,
    value: district.value,
  }));
};

// Transform media types to bar chart format
export const transformMediaTypesToBarData = (mediaTypes: ChartDataItem[]) => {
  return mediaTypes.map(type => ({
    name: type.name,
    Quantidade: type.value,
  }));
};

// Transform origins to bar chart format
export const transformOriginsToBarData = (origins: ChartDataItem[]) => {
  return origins.map(origin => ({
    name: origin.name,
    Solicitações: origin.value,
  }));
};

// Transform response times to line chart format
export const transformResponseTimesToLineData = (responseTimes: ChartDataItem[]) => {
  return responseTimes.map(time => ({
    name: time.name,
    Demandas: time.value,
  }));
};

// Transform problems to bar chart format
export const transformProblemasToBarData = (problemas: ChartDataItem[]) => {
  return problemas.map(problema => ({
    name: problema.name,
    Quantidade: problema.value,
  }));
};

// Transform coordinations to bar chart format
export const transformCoordinationsToBarData = (coordinations: ChartDataItem[]) => {
  return coordinations.map(coord => ({
    name: coord.name,
    Respostas: coord.value,
  }));
};

// Transform status to pie chart format
export const transformStatusToPieData = (statuses: ChartDataItem[]) => {
  return statuses.map(status => ({
    name: status.name,
    value: status.value,
  }));
};

// Transform approvals to pie chart format
export const transformApprovalsToPieData = (approvals: ChartDataItem[]) => {
  return approvals.map(approval => ({
    name: approval.name,
    value: approval.value,
  }));
};

// Transform responsibles to bar chart format
export const transformResponsiblesToBarData = (responsibles: ChartDataItem[]) => {
  return responsibles.map(responsible => ({
    name: responsible.name,
    Quantidade: responsible.value,
  }));
};

// Transform neighborhoods to bar chart format
export const transformNeighborhoodsToBarData = (neighborhoods: ChartDataItem[]) => {
  return neighborhoods.map(neighborhood => ({
    name: neighborhood.name,
    Quantidade: neighborhood.value,
    district: neighborhood.district,
  }));
};
