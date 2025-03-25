
// Add or update the following types
export type SGZAreaTecnica = "STM" | "STLP";

export interface SGZOrdemServico {
  id: string;
  ordem_servico: string;
  sgz_area_tecnica: SGZAreaTecnica;
  sgz_classificacao_servico: string;
  sgz_status: string;
  sgz_fornecedor: string | null;
  sgz_distrito: string | null;
  sgz_bairro: string | null;
  sgz_logradouro: string | null;
  sgz_numero: string | null;
  sgz_cep: string | null;
  sgz_criado_em: string | null;
  sgz_data_status: string | null;
  sgz_dias_ate_status_atual: number | null;
  planilha_referencia: string | null;
}

export interface SGZPlanilhaUpload {
  id?: string;
  arquivo_nome: string;
  data_upload?: string;
  usuario_upload?: string;
  status_upload?: string;
  qtd_ordens_processadas?: number;
  qtd_ordens_validas?: number;
}

export interface SGZFilterOptions {
  status: string[];
  areaTecnica: string;
  distrito: string[];
  fornecedor: string[];
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

export const isValidSGZAreaTecnica = (value: string): value is SGZAreaTecnica => {
  return value === "STM" || value === "STLP";
};
