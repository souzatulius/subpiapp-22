
export interface DetalhesDemandaProps {
  demandaId: string;
  onClose: () => void;
}

export interface AreaCoordenacao {
  id: string;
  descricao: string;
}

export interface Autor {
  nome_completo: string;
}

export interface Usuario {
  nome_completo: string;
}

export interface Resposta {
  id: string;
  texto: string;
  arquivo_url?: string;
  criado_em: string;
  usuario?: Usuario;
}

export interface Demanda {
  id: string;
  titulo: string;
  status: string;
  horario_publicacao: string;
  prazo_resposta: string;
  detalhes_solicitacao?: string;
  perguntas?: Record<string, string>;
  arquivo_url?: string;
  areas_coordenacao?: AreaCoordenacao;
  autor?: Autor;
}

export interface PerguntaResposta {
  pergunta: string;
  resposta: string;
}

export interface NotaExistente {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  demanda_id?: string;
}
