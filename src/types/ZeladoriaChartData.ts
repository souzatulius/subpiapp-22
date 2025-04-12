
export type ZeladoriaChartData = {
  kpis: {
    total_os: number;
    os_fechadas: number;
    os_pendentes: number;
    os_canceladas: number;
    os_fora_do_prazo: number;
    media_dias_atendimento: number;
  };
  por_distrito: Record<string, number>;
  por_status: Record<string, number>;
  por_responsavel: Record<string, number>;
  por_tipo_servico_agrupado: Record<string, number>;
  tempo_medio_por_status: Record<string, number>;
  tempo_abertura_distribuicao: Record<string, number>;
  prazo_fechamento_distribuicao: Record<string, number>;
  mais_frequentes: { servico: string; quantidade: number }[];
  evolucao_diaria: Record<string, number>;
  fluxo_status: { from: string; to: string; count: number }[];
};
