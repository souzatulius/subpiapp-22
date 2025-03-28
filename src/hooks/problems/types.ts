
import { z } from 'zod';

export interface SupervisaoTecnica {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
  coordenacao?: {
    id: string;
    descricao: string;
  };
}

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

// Making this interface aligned with CoordinationArea to fix type errors
export interface Area {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao_id?: string;
  coordenacao?: {
    id: string;
    descricao: string;
  };
}

export const problemSchema = z.object({
  descricao: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  coordenacao_id: z.string().min(1, 'Selecione uma coordenação'),
  supervisao_tecnica_id: z.string().optional(),
  icone: z.string().optional(),
});
