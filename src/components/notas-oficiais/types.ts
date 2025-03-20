
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
  protocolo?: string;
  prioridade?: string;
}

export interface PerguntaResposta {
  pergunta: string;
  resposta: string;
}

// Define NotaExistente without any recursive references
export interface NotaExistente {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  demanda_id?: string;
}

// Add NotaOficial interface that was missing
export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  autor_id: string;
  criado_em: string;
  atualizado_em: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  demanda_id?: string;
}
