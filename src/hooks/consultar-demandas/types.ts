
export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: {
    id: string;
    descricao: string;
  };
  problema: {
    id: string;
    descricao: string;
    coordenacao?: {
      id: string;
      descricao: string;
      sigla?: string;
    };
  } | null;
  problema_id?: string;
  supervisao_tecnica: {
    id: string;
    descricao: string;
  };
  origem: {
    id: string;
    descricao: string;
  };
  tipo_midia: {
    id: string;
    descricao: string;
  };
  bairro: {
    nome: string;
  };
  autor: {
    nome_completo: string;
  };
  endereco: string;
  nome_solicitante: string;
  email_solicitante: string;
  telefone_solicitante: string;
  veiculo_imprensa: string;
  detalhes_solicitacao: string;
  perguntas: any | null;
  servico: {
    id: string;
    descricao: string;
  };
  arquivo_url: string | null;
  anexos: any[] | null;
  resposta?: DemandResponse | null;
  notas?: Note[] | null;
}

export interface Note {
  id: string;
  demanda_id: string;
  titulo: string;
  autor_id: string;
}

export interface DemandResponse {
  id: string;
  demanda_id: string;
  texto: string;
  usuario_id: string;
  criado_em: string;
  respostas?: any;
  comentarios?: string;
}
