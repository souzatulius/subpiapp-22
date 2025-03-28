
import { z } from 'zod';

export interface SupervisaoTecnica {
  id: string;
  descricao: string;
}

export interface Service {
  id: string;
  descricao: string;
  supervisao_tecnica_id?: string;
  problema_id: string;
  supervisao_tecnica?: SupervisaoTecnica;
  problema?: {
    id: string;
    descricao: string;
  };
  criado_em?: string;
}

export interface Area {
  id: string;
  descricao: string;
  sigla?: string;
}

export const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  problema_id: z.string().min(1, 'Selecione um problema/tema')
});
