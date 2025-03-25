export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  autor_id: string;
  problema_id: string;
  aprovador_id?: string;
  area_coordenacao_id?: string;
  demanda_id?: string;
  criado_em: string;
  atualizado_em: string;
  autor?: {
    id: string;
    nome_completo: string;
  };
  areas_coordenacao?: {
    id: string;
    descricao: string;
  };
}
