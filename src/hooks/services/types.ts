
import { SupervisaoTecnica } from '@/types/common';

export interface Service {
  id: string;
  descricao: string;
  supervisao_id: string;
  supervisao_tecnica_id?: string;
  problema_id: string;
  supervisao_tecnica?: SupervisaoTecnica;
  criado_em?: string;
}

export interface Area extends SupervisaoTecnica {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
}

export const serviceSchema = {
  descricao: {
    required: 'A descrição é obrigatória',
    minLength: {
      value: 3,
      message: 'A descrição deve ter pelo menos 3 caracteres'
    }
  },
  supervisao_tecnica_id: {
    required: 'A supervisão técnica é obrigatória'
  }
};
