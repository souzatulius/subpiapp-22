
import { z } from 'zod';

export interface Problem {
  id: string;
  descricao: string;
  supervisao_tecnica_id?: string;
  coordenacao_id?: string;
  icone?: string;
  criado_em?: string;
}

export interface Area {
  id: string;
  descricao: string;
}

export const problemSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  supervisao_tecnica_id: z.string().optional(),
  coordenacao_id: z.string().optional(),
  icone: z.string().optional(),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
