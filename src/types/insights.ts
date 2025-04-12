
export interface Indicador {
  valor: string;
  comentario: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface InsightResult {
  fechadas?: Indicador;
  pendentes?: Indicador;
  canceladas?: Indicador;
  prazo_medio?: Indicador;
  fora_do_prazo?: Indicador;
  [key: string]: Indicador | undefined;
}
