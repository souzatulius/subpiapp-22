
import { z } from 'zod';

export interface Service {
  id: string;
  descricao: string;
  supervisao_id?: string;
  supervisao_tecnica_id?: string;
  problema_id?: string;
  supervisao_tecnica?: {
    id: string;
    descricao: string;
  };
  criado_em?: string;
}

export interface Area {
  id: string;
  descricao: string;
  coordenacao_id?: string;
  sigla?: string;
}

export const serviceSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  supervisao_tecnica_id: z.string({ required_error: "A supervisão técnica é obrigatória" })
});
