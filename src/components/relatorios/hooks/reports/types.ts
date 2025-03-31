
export interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao: number;
}

export interface ChartData {
  name: string;
  value: number;
  district?: string;
}

export interface ReportsData {
  districts: ChartData[];
  neighborhoods: ChartData[];
  origins: ChartData[];
  mediaTypes: ChartData[];
  responseTimes: ChartData[];
  services: ChartData[];
  coordinations: ChartData[];
  statuses: ChartData[];
  responsibles: ChartData[];
  approvals: ChartData[];
}

export interface TempoRespostaData {
  id: number;
  criado_em: string;
  respostas: {
    criado_em: string;
  }[];
}
