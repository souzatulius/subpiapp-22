
// Export these interfaces to be used in components
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
  statuses: string[];
  serviceTypes: string[];
  districts: string[];
}

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
  processed?: boolean;
}

export interface SGZUpload {
  id: string;
  nome_arquivo: string;
  usuario_id: string;
  data_upload: string;
  processado: boolean;
}

export interface SGZOrdemServico {
  id: string;
  ordem_servico: string;
  sgz_tipo_servico: string;
  sgz_empresa: string;
  sgz_status: string;
  sgz_criado_em: string;
  sgz_modificado_em: string;
  sgz_bairro: string;
  sgz_distrito: string;
  sgz_departamento_tecnico: string;
  sgz_dias_ate_status_atual?: number;
  planilha_referencia: string;
}
