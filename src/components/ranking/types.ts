
export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

export interface ChartVisibility {
  statusDistribution: boolean;
  resolutionTime: boolean;
  topCompanies: boolean;
  districtDistribution: boolean;
  servicesByDepartment: boolean;
  servicesByDistrict: boolean;
  timeComparison: boolean;
  efficiencyImpact: boolean;
  dailyDemands: boolean;
  neighborhoodComparison: boolean;
  districtEfficiencyRadar: boolean;
  statusTransition: boolean;
  criticalStatus: boolean;
  externalDistricts: boolean;
  serviceDiversity: boolean;
  closureTime: boolean;
}

export interface FilterOptions {
  dateRange?: {
    from: Date;
    to: Date;
  };
  statuses: ('Todos' | 'PREPLAN' | 'PRECANC' | 'Aprovado' | 'Em Andamento' | 'Concluído' | 'FECHADO')[];
  serviceTypes: ('Todos' | string)[];
  districts: ('Todos' | 'Pinheiros' | 'Itaim Bibi' | 'Alto de Pinheiros' | 'Jardim Paulista')[];
}

export interface SGZOrdemServico {
  id: string;
  ordem_servico: string;
  sgz_status: string;
  sgz_departamento_tecnico: string; // Mudado de "STM" | "STLP" para string para resolver o erro de tipagem
  sgz_bairro: string;
  sgz_distrito: string;
  sgz_tipo_servico: string;
  sgz_empresa: string;
  sgz_criado_em: string;
  sgz_modificado_em: string;
  sgz_dias_ate_status_atual?: number;
  planilha_referencia: string;
}

export interface SGZUpload {
  id: string;
  nome_arquivo: string;
  data_upload: string;
  usuario_id: string;
  processado: boolean;
}
