
export interface Release {
  id: string;
  tipo: 'release' | 'noticia';
  titulo?: string;
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
  publicada?: boolean;
  atualizado_em?: string;
}

export interface GeneratedNews {
  titulo: string;
  conteudo: string;
}
