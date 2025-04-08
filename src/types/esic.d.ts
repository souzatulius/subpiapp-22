
export interface ESICProcesso {
  id: string;
  protocolo: string;
  assunto: string; 
  solicitante?: string;
  data_processo: string;
  criado_em: string;
  created_at: string;
  atualizado_em: string;
  autor_id: string;
  autor_nome?: string;
  texto: string;
  situacao: string;
  status: "aberto" | "em_andamento" | "concluido" | "cancelado" | "respondido";
  autor?: {
    nome_completo: string;
  };
}
