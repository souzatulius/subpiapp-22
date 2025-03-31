
export interface ChartData {
  name: string;
  value?: number;
  Demandas?: number;
  Quantidade?: number;
  Notas?: number;
  Respostas?: number;
  Solicitações?: number;
  Satisfação?: number;
  Aberto?: number;
  EmAndamento?: number;
  Concluído?: number;
  Dias?: number;
  Concluídas?: number;
}

export interface ChartConfig {
  data: ChartData[];
  xAxisDataKey: string;
  bars?: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  lines?: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
  areas?: {
    dataKey: string;
    name: string;
    color: string;
    fillOpacity?: number;
  }[];
  colors?: string[];
}

export interface ChartComponentsCollection {
  [key: string]: React.ReactNode;
}
