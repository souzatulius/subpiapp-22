
export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  coordenacao_id?: string;
  problema_id?: string;
  supervisao_tecnica_id?: string;
  supervisao_tecnica?: {
    id?: string;
    descricao: string;
  } | null;
  area_coordenacao: {
    descricao: string;
  } | null;
  origem: {
    descricao: string;
  } | null;
  tipo_midia: {
    descricao: string;
  } | null;
  bairro: {
    nome: string;
    distritos?: {
      nome: string;
    }
  } | null;
  autor: {
    nome_completo: string;
  } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null | any;
  servico: {
    descricao: string;
  } | null;
  arquivo_url: string | null;
  anexos: string[] | null;
  servico_id?: string;
  problema: {
    descricao: string | null;
  } | null;
  protocolo?: string | null;
}

export interface ResponseQA {
  question: string;
  answer: string;
}
