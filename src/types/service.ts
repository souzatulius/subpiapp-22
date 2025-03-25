
import { z } from 'zod';
import { SupervisaoTecnica } from './common';

export interface Service {
  id: string;
  descricao: string;
  supervisao_tecnica_id: string;
  supervisao_tecnica?: SupervisaoTecnica;
  criado_em?: string;
}

export const serviceSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  supervisao_tecnica_id: z.string({ required_error: "A supervisão técnica é obrigatória" })
});
