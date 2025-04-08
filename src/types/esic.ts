
export interface ESICProcesso {
  id: string;
  assunto: string;
  texto: string;
  protocolo: string;
  solicitante?: string;
  autor_id: string;
  autor_nome?: string;
  status: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';
  situacao?: string;
  data_processo?: string;
  criado_em: string;
  atualizado_em: string;
}
