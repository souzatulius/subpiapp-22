
import { z } from 'zod';
import { SupervisaoTecnica } from '@/types/common';

export interface Problem {
  id: string;
  descricao: string;
  supervisao_tecnica_id: string;
  supervisao_tecnica?: SupervisaoTecnica;
  icone?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface Area {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
  coordenacao?: string;
}

export const problemSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  supervisao_tecnica_id: z.string({ required_error: "A supervisão técnica é obrigatória" }),
  icone: z.string().optional()
});

// Use 'export type' syntax for re-exporting types
export type { SupervisaoTecnica };
