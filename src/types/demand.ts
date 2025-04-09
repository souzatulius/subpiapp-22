
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
}
