
import { z } from 'zod';

export const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  supervisao_tecnica_id: z.string().min(1, 'Selecione uma supervisão técnica'),
});

export type Service = {
  id: string;
  descricao: string;
  supervisao_id: string;
  problema_id: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
    criado_em?: string;
  };
  criado_em: string;
};
