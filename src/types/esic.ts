
// If this file doesn't exist, we'll create it with the needed types
export interface ESICProcesso {
  id: string;
  protocolo: string;
  assunto: string;
  solicitante?: string;
  data_processo: string | Date;
  autor_id: string;
  texto: string;
  status: 'novo_processo' | 'aberto' | 'em_andamento' | 'concluido' | 'cancelado' | 'aguardando_justificativa' | 'aguardando_aprovacao';
  situacao: string;
  coordenacao_id?: string | null;
  prazo_resposta?: string | Date | null;
  created_at?: string;
  updated_at?: string;
  // Add the missing fields that appear in the errors
  criado_em?: string;
  atualizado_em?: string;
  autor?: {
    nome_completo?: string;
  };
  // Renamed from coordenacao to avoid type error
  coordenacao_id_info?: {
    nome: string;
  };
}

export interface ESICProcessoFormValues {
  protocolo: string;
  assunto: string;
  solicitante?: string;
  data_processo: Date | string;
  texto: string;
  situacao: string;
  coordenacao_id?: string;
  prazo_resposta?: Date | string;
  sem_area_tecnica?: boolean;
  sem_identificacao?: boolean;
}

export interface ESICJustificativa {
  id: string;
  processo_id: string;
  texto: string;
  autor_id: string;
  gerado_por_ia: boolean;
  created_at?: string;
  updated_at?: string;
  // Add the missing fields that appear in the errors
  criado_em: string;
  atualizado_em?: string;
  autor?: {
    nome_completo?: string;
  };
}

// Add the missing ESICJustificativaFormValues interface
export interface ESICJustificativaFormValues {
  texto: string;
  gerado_por_ia: boolean;
  rascunho?: string;
}

export const situacaoLabels: Record<string, string> = {
  em_tramitacao: "Em tramitação",
  deferido: "Deferido",
  indeferido: "Indeferido",
  parcialmente_deferido: "Parcialmente deferido",
  nao_conhecimento: "Não conhecimento"
};

// Add the missing statusLabels
export const statusLabels: Record<string, string> = {
  novo_processo: "Novo",
  aberto: "Aberto",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
  aguardando_justificativa: "Aguardando justificativa",
  aguardando_aprovacao: "Aguardando aprovação"
};
