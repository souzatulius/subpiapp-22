
import { z } from 'zod';
import { SupervisaoTecnica } from './common';

export interface Problem {
  id: string;
  descricao: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  supervisao_tecnica?: SupervisaoTecnica;
  coordenacao?: {
    id: string;
    descricao: string;
  };
  icone?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const problemSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  coordenacao_id: z.string({ required_error: "A coordenação é obrigatória" }),
  icone: z.string().optional()
});
