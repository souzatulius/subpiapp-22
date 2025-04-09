
export interface ESICProcesso {
  id: string;
  protocolo: string;
  assunto: string; 
  solicitante?: string;
  data_processo: string;
  criado_em: string;
  created_at?: string;
  atualizado_em: string;
  autor_id: string;
  autor_nome?: string;
  texto: string;
  situacao: string;
  status: "aberto" | "em_andamento" | "concluido" | "cancelado" | "aguardando_justificativa" | "aguardando_aprovacao" | "novo_processo";
  autor?: {
    nome_completo?: string;
  };
  coordenacao_id?: string;
  prazo_resposta?: string;
  coordenacao?: {
    nome?: string;
  };
}

export interface ESICProcessoFormValues {
  data_processo: Date;
  texto: string;
  situacao: string;
  assunto: string;
  solicitante?: string;
  coordenacao_id?: string | null;
  prazo_resposta?: Date | null;
  sem_area_tecnica?: boolean;
  sem_identificacao?: boolean;
}

export interface ESICJustificativa {
  id: string;
  processo_id: string;
  texto: string;
  gerado_por_ia: boolean;
  autor_id: string;
  criado_em: string;
  atualizado_em: string;
  autor?: {
    nome_completo: string;
  };
}

export interface ESICJustificativaFormValues {
  texto: string;
  gerado_por_ia: boolean;
}

export const statusLabels: Record<string, string> = {
  'novo_processo': 'Novo Processo',
  'aberto': 'Aberto',
  'em_andamento': 'Em andamento',
  'aguardando_justificativa': 'Aguardando Justificativa',
  'aguardando_aprovacao': 'Aguardando Aprovação',
  'concluido': 'Concluído',
  'cancelado': 'Cancelado'
};

export const situacaoLabels: Record<string, string> = {
  'em_tramitacao': 'Em Tramitação',
  'prazo_prorrogado': 'Prazo Prorrogado',
  'concluido': 'Concluído'
};
