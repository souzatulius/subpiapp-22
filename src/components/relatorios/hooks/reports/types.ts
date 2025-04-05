
export interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao?: number;  // Adding the missing property
  notasAprovadas: number;
  notasEditadas: number;
  noticiasPublicas?: number;
  totalReleases?: number;
  noticiasVariacao?: number;
}

export interface ChartData {
  [key: string]: any;
}

export interface ReportsData {
  cardStats: CardStats;
  chartData: ChartData;
}
