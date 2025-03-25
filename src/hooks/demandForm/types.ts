
export interface DemandFormData {
  titulo: string;
  problema_id: string;
  servico_id?: string; // Make optional
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
  anexos: string[]; // Added property for multiple attachments
  tem_protocolo_156: boolean; // Novo campo para indicar se existe protocolo 156
  numero_protocolo_156?: string; // Novo campo para armazenar o número do protocolo 156 (opcional)
}

export interface FormState {
  formData: DemandFormData;
  areasCoord: any[];
  servicos: any[];
  origens: any[];
  tiposMidia: any[];
  distritos: any[];
  bairros: any[];
  problemas: any[];
  filteredServicos: any[];
  filteredBairros: any[];
  isLoading: boolean;
  serviceSearch: string;
  selectedDistrito: string;
  activeStep: number;
}
