
export interface ESICProcesso {
  id: string;
  data_processo: string;
  situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido';
  status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido';
  texto: string;
  autor_id: string;
  criado_em: string;
  atualizado_em: string;
  coordenacao_id?: string;
  prazo_resposta?: string;
  autor?: {
    nome_completo: string;
  };
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

export type ESICProcessoFormValues = {
  data_processo: Date;
  situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido';
  texto: string;
  coordenacao_id?: string;
  prazo_resposta?: Date;
};

export type ESICJustificativaFormValues = {
  texto: string;
  gerado_por_ia: boolean;
};

export type ESICStatusLabels = {
  [key: string]: string;
};

export type ESICSituacaoLabels = {
  [key: string]: string;
};

export const statusLabels: ESICStatusLabels = {
  'novo_processo': 'Novo Processo',
  'aguardando_justificativa': 'Aguardando Justificativa',
  'aguardando_aprovacao': 'Aguardando Aprovação',
  'concluido': 'Concluído'
};

export const situacaoLabels: ESICSituacaoLabels = {
  'em_tramitacao': 'Em Tramitação',
  'prazo_prorrogado': 'Prazo Prorrogado',
  'concluido': 'Concluído'
};
