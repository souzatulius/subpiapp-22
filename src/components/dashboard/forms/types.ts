
export interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  autor_id: string;
  criado_em: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  areas_coordenacao?: {
    descricao: string;
  };
  autor?: {
    nome_completo: string;
  } | null;
}
