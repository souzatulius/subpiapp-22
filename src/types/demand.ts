
export interface Demand {
  id: string;
  title: string;
  descricao: string;
  status: 'pendente' | 'respondida' | 'aprovada' | 'recusada';
  urgente: boolean;
  dataCriacao: string;
  dataResposta?: string;
  origem?: string;
  tema?: string;
  servico?: string;
  area?: string;
  protocolo?: string;
  requesterName?: string;
  requesterOrg?: string;
  
  // Additional properties needed by criar-nota components
  titulo?: string;
  prioridade?: string;
  horario_publicacao?: string;
  prazo_resposta?: string;
  endereco?: string | null;
  nome_solicitante?: string | null;
  email_solicitante?: string | null;
  cep?: string | null;
  numero?: string | null;
  referencia?: string | null;
  bairro_id?: string | null;
  problema_id?: string | null;
  coordenacao_id?: string | null;
  supervisao_tecnica_id?: string | null;
  tema_id?: string | null;
  servico_id?: string | null;
  area_coordenacao?: {
    descricao: string;
  } | null;
  
  // Properties for useDemandasData
  tipo_midia?: string;
  bairro?: string;
  autor?: string;
  telefone_solicitante?: string;
  foto?: string;
  regiao?: string;
  foto_url?: string;
  notas?: Note[];
  
  // Properties needed by criar-nota
  veiculo_imprensa?: string;
  detalhes_solicitacao?: string;
  perguntas?: string;
  arquivo_url?: string;
  tipo_veiculo?: string;
  supervisao_tecnica?: any;
}

export interface Note {
  id: string;
  titulo: string;
  conteudo: string;
  status: string;
  data_criacao: string;
  autor_id: string;
  demanda_id?: string;
}

export interface CriarNotaFormProps {
  demandaId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}
