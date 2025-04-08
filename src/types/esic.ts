
export interface ESICProcesso {
  id: string;
  assunto: string;
  texto: string;
  protocolo: string;
  solicitante?: string;
  autor_id: string;
  autor_nome?: string;
  status: 'aberto' | 'em_andamento' | 'concluido' | 'cancelado' | 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao';
  situacao?: string;
  data_processo?: string;
  criado_em: string;
  created_at: string;
  atualizado_em: string;
  autor?: {
    nome_completo: string;
  };
  coordenacao_id?: string;
  prazo_resposta?: string;
}

export interface ESICProcessoFormValues {
  data_processo: Date;
  texto: string;
  situacao: string;
  assunto?: string;
  solicitante?: string;
  coordenacao_id?: string;
  prazo_resposta?: string | Date;
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
