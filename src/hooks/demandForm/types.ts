
export interface DemandFormData {
  titulo: string;
  area_coordenacao_id: string;
  servico_id: string;
  origem_id: string;
  tipo_midia_id: string;
  prioridade: string;
  prazo_resposta: string;
  nome_solicitante: string;
  telefone_solicitante: string;
  email_solicitante: string;
  veiculo_imprensa: string;
  endereco: string;
  bairro_id: string;
  perguntas: string[];
  detalhes_solicitacao: string;
  arquivo_url: string;
}

export interface FormState {
  formData: DemandFormData;
  areasCoord: any[];
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  distritos: any[];
  bairros: any[];
  filteredServicos: any[];
  filteredBairros: any[];
  isLoading: boolean;
  serviceSearch: string;
  selectedDistrito: string;
  activeStep: number;
}
