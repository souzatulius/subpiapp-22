
// General ranking types
export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

export interface FilterOptions {
  dateRange?: { from: Date; to: Date };
  statuses: string[];
  serviceTypes: string[];
  districts: string[];
}

export interface ChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  frequentServices: boolean;
  statusDistribution: boolean;
}

// SGZ specific types
export type SGZAreaTecnica = "STM" | "STLP";

export interface SGZOrdemServico {
  id?: string;
  ordem_servico: string;
  sgz_status: string;
  sgz_area_tecnica: SGZAreaTecnica;
  sgz_bairro: string;
  sgz_distrito: string;
  sgz_logradouro?: string;
  sgz_cep?: string;
  sgz_tipo_servico: string;
  sgz_fornecedor?: string;
  sgz_classificacao_servico?: string;
  sgz_criado_em: string;
  sgz_data_status?: string;
  sgz_dias_ate_status_atual?: number;
  sgz_numero?: string;
  planilha_referencia: string;
}

export interface SGZUpload {
  id: string;
  nome_arquivo: string;
  data_upload: string;
  usuario_id: string;
  processado: boolean;
  qtd_ordens_processadas?: number;
  qtd_ordens_validas?: number;
}

export interface SGZFilterOptions {
  periodo?: {
    de?: Date;
    ate?: Date;
  };
  statuses: string[];
  areas_tecnicas: SGZAreaTecnica[];
  distritos: string[];
  bairros: string[];
  tipos_servico: string[];
}

export interface SGZChartVisibility {
  distribuicao_status: boolean;
  tempo_medio: boolean;
  empresas_concluidas: boolean;
  ordens_por_area: boolean;
  servicos_mais_realizados: boolean;
  servicos_por_distrito: boolean;
  comparativo_tempo: boolean;
  impacto_eficiencia: boolean;
  volume_diario: boolean;
  comparativo_bairros: boolean;
  radar_eficiencia: boolean;
  transicao_status: boolean;
  status_criticos: boolean;
  ordens_externas: boolean;
  diversidade_servicos: boolean;
  tempo_fechamento: boolean;
}

export interface UploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message?: string;
  error?: string;
  estimatedTimeRemaining?: number;
}
