
export interface OrdemServico {
  id: number;
  ordem_servico: string;
  classificacao: string | null;
  criado_em: string | null;
  status: string | null;
  dias: number | null;
  bairro: string | null;
  distrito: string | null;
  ultima_atualizacao: string;
}

export interface UploadLog {
  id: number;
  usuario_id: string;
  nome_arquivo: string;
  registros_inseridos: number;
  registros_atualizados: number;
  data_upload: string;
}

export interface ChartData {
  id: string;
  title: string;
  description?: string;
  type: 'bar' | 'pie' | 'line' | 'indicator' | 'horizontalBar' | 'groupedBar';
  data: any;
  visible: boolean;
}

export interface ChartFilters {
  distrito?: string | null;
  bairro?: string | null;
  classificacao?: string | null;
  status?: string | null;
  dataDe?: string | null;
  dataAte?: string | null;
}

export interface OrdensStats {
  totalOrdens: number;
  tempoMedioResolucao: number;
  totalPorDistrito: Record<string, number>;
  totalPorClassificacao: Record<string, number>;
  totalPorStatus: Record<string, number>;
  totalPorBairro: Record<string, number>;
}
