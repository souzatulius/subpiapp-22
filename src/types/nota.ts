
export interface NotaEdicao {
  id: string;
  nota_id?: string;
  editor_id?: string;
  texto_anterior?: string;
  texto_novo?: string;
  titulo_anterior?: string;
  titulo_novo?: string;
  criado_em: string;
  editor?: {
    nome_completo: string;
  } | null;
}

export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  autor_id: string;
  autor?: {
    id: string;
    nome_completo: string;
  } | null;
  aprovador_id?: string | null;
  aprovador?: {
    id: string;
    nome_completo: string;
  } | null;
  problema_id: string;
  problema?: {
    id: string;
    descricao: string;
  } | null;
  supervisao_tecnica_id?: string | null;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
  } | null;
  demanda_id?: string | null;
  demanda?: {
    id: string;
    titulo: string;
  } | null;
  historico_edicoes?: NotaEdicao[];
  area_coordenacao: {
    id: string;
    descricao: string;
  };
}
