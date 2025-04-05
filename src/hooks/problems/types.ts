
import { z } from 'zod';

export interface Problem {
  id: string;
  descricao: string;
  coordenacao_id?: string;
  supervisao_tecnica_id?: string;
  coordenacao?: {
    id: string;
    descricao: string;
  };
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    coordenacao_id?: string;
  };
  icone?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface Area {
  id: string;
  descricao: string;
  sigla?: string;
}

export const problemSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  coordenacao_id: z.string().min(1, "Coordenação é obrigatória"),
  icone: z.string().optional(),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
