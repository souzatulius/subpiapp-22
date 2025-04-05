
export interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao?: number;
  notasAprovadas: number;
  notasEditadas: number;
  noticiasPublicas?: number;
  totalReleases?: number;
  noticiasVariacao?: number;
  notasAguardando?: number;
}

export interface ChartData {
  [key: string]: any;
}

export interface ReportsData {
  cardStats: CardStats;
  chartData: ChartData;
  districts?: any[];
  origins?: any[];
  responseTimes?: any[];
  problemas?: any[];
  coordinations?: any[];
  mediaTypes?: any[];
  neighborhoods?: any[]; 
  statuses?: any[];
  responsibles?: any[];
  approvals?: any[];
}
