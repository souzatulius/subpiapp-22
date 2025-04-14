
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
    id?: string;
  } | null;
  origem: {
    descricao: string;
    id?: string;
  } | null;
  tipo_midia: {
    descricao: string;
    id?: string;
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
    id?: string;
  } | null;
  arquivo_url: string | null;
  anexos: string[] | null;
  servico_id?: string;
  problema: {
    descricao: string | null;
    id?: string;
    coordenacao?: any;
  } | null;
  protocolo?: string | null;
  notas?: Note[] | null;
  origem_id?: string;
  tipo_midia_id?: string;
  created_at?: string;
  resumo_situacao?: string | null;
}

export interface Note {
  id: string;
  titulo: string;
  conteudo?: string;
  status?: string;
  data_criacao?: string;
  autor_id: string;
  demanda_id?: string;
}

export interface ResponseQA {
  question: string;
  answer: string;
}
