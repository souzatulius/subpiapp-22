
export interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  notasAprovadas: number;
  notasEditadas: number;
  noticiasPublicas?: number;
  totalReleases?: number;
  noticiasVariacao?: number;
}

export interface ChartData {
  [key: string]: any;
}
