
export interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao: number;
  notasAguardando?: number;
  notasEditadas?: number;
  notasAprovadas?: number; // Add the missing property
}

export interface ChartDataItem {
  name: string;
  value: number;
  district?: string; // Para itens com relação distrito/bairro
}

export interface ReportsData {
  districts: ChartDataItem[];
  neighborhoods: ChartDataItem[];
  origins: ChartDataItem[];
  mediaTypes: ChartDataItem[];
  responseTimes: ChartDataItem[];
  problemas: ChartDataItem[];
  coordinations: ChartDataItem[];
  statuses: ChartDataItem[];
  responsibles: ChartDataItem[];
  approvals: ChartDataItem[];
}
