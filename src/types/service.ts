
import { z } from 'zod';
import { SupervisaoTecnica } from './common';

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

export const serviceSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  problema_id: z.string({ required_error: "O problema/tema é obrigatório" })
});
