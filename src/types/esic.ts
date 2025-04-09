
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
  status: "novo_processo" | "aberto" | "em_andamento" | "concluido" | "cancelado" | "respondido" | "aguardando_justificativa" | "aguardando_aprovacao";
  autor?: {
    nome_completo: string;
  };
  coordenacao_id?: string;
  prazo_resposta?: string;
  coordenacao?: {
    nome: string;
  };
  sem_area_tecnica?: boolean;
}

export interface ESICProcessoFormValues {
  assunto: string;
  solicitante?: string;
  texto: string;
  data_processo: Date;
  situacao: string;
  coordenacao_id?: string;
  prazo_resposta?: Date;
  sem_area_tecnica?: boolean;
  sem_identificacao?: boolean;
}

export interface ESICJustificativa {
  id: string;
  texto: string;
  processo_id: string;
  autor_id: string;
  autor_nome?: string;
  criado_em: string;
  gerado_por_ia: boolean;
  autor?: {
    nome_completo: string;
  };
}

export interface ESICJustificativaFormValues {
  texto: string;
  gerado_por_ia: boolean;
}

export const statusLabels = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  respondido: 'Respondido',
  novo_processo: 'Novo Processo',
  aguardando_justificativa: 'Aguardando Justificativa',
  aguardando_aprovacao: 'Aguardando Aprovação'
};

export const situacaoLabels = {
  em_tramitacao: 'Em tramitação',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  pendente: 'Pendente',
  prazo_prorrogado: 'Prazo Prorrogado'
};
