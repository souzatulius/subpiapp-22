export interface DemandFormData {
  titulo: string;
  problema_id: string;
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
  anexos: string[]; 
  tem_protocolo_156?: boolean;
  numero_protocolo_156?: string;
  servico_id?: string; // Add optional servico_id
  nao_sabe_servico?: boolean; // Keep this for "I don't know the service" option
}
