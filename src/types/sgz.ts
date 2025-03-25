
export interface SGZOrdemServico {
  ordem_servico: string;
  sgz_classificacao_servico: string;
  sgz_area_tecnica: 'STM' | 'STLP';
  sgz_fornecedor?: string;
  sgz_status: string;
  sgz_data_status: string;
  sgz_criado_em: string;
  sgz_prioridade?: string;
  sgz_logradouro?: string;
  sgz_numero?: string;
  sgz_bairro?: string;
  sgz_distrito?: string;
  sgz_cep?: string;
  sgz_dias_ate_status_atual?: number;
  id?: string;
  planilha_referencia?: string;
  data_upload?: string;
}

export interface SGZPlanilhaUpload {
  id?: string;
  arquivo_nome: string;
  data_upload?: string;
  usuario_upload?: string;
  qtd_ordens_processadas?: number;
  qtd_ordens_validas?: number;
  status_upload?: string;
}

export interface SGZStatusHistorico {
  id?: string;
  ordem_servico: string;
  status_antigo?: string;
  status_novo: string;
  data_mudanca?: string;
  planilha_origem: string;
}

export interface SGZConfiguracoesUsuario {
  id?: string;
  usuario_id: string;
  filtros_ativos?: Record<string, any>;
  ordem_dos_cards?: Record<string, any>;
  cards_visiveis?: string[];
  data_atualizacao?: string;
}

export interface SGZChartData {
  statusDistribution: any;
  areaDistribution: any;
  servicosFrequentes: any;
  tempoMedioPorStatus: any;
  distribuicaoPorDistrito: any;
  evolucaoStatus: any;
  lastUpdated: string;
}

export interface SGZFilterOptions {
  status: string[];
  areaTecnica: 'Todos' | 'STM' | 'STLP';
  distrito: string[];
  dataDe?: Date;
  dataAte?: Date;
  fornecedor: string[];
}
