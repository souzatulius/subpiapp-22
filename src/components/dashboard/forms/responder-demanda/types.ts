
export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  problema_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  bairro_id?: string;
  servico_id?: string;
  origem_id?: string;
  tipo_midia_id?: string;
  autor_id?: string;
  area_coordenacao?: {
    id?: string;
    descricao: string;
  };
  supervisao_tecnica?: {
    id?: string;
    descricao: string;
  };
  problema?: {
    id?: string;
    descricao: string;
    coordenacao?: {
      id?: string;
      sigla?: string;
      descricao?: string;
    };
  };
  bairro?: {
    id?: string;
    nome: string;
  };
  servico?: {
    id?: string;
    descricao: string;
  };
  origem?: {
    id?: string;
    descricao: string;
  };
  tipo_midia?: {
    id?: string;
    descricao: string;
  };
  autor?: {
    id: string;
    nome_completo: string;
  };
  tema?: {
    id?: string;
    descricao?: string;
    coordenacao?: {
      id?: string;
      sigla?: string;
      descricao?: string;
    };
  };
  veiculo_imprensa?: string;
  nome_solicitante?: string;
  email_solicitante?: string;
  telefone_solicitante?: string;
  endereco?: string;
  detalhes_solicitacao?: string;
  perguntas?: Record<string, string>;
  anexos?: string[];
  coordenacao?: {
    id?: string;
    sigla?: string;
    descricao?: string;
  };
  resumo_situacao?: string;
  created_at?: string;
}

export type ViewMode = "list" | "grid";

export interface ResponseData {
  id: string;
  demanda_id: string;
  usuario_id: string;
  respostas: Record<string, string>;
  texto: string;
  comentarios: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Question {
  key: string;
  question: string;
}
