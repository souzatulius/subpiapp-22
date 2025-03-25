
import { z } from 'zod';

export const problemSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  area_coordenacao_id: z.string().min(1, 'Selecione uma área de coordenação'),
});

export type Problem = {
  id: string;
  descricao: string;
  area_coordenacao_id: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
    criado_em?: string;
  };
  criado_em: string;
  atualizado_em: string;
};

export type Area = {
  id: string;
  descricao: string;
  criado_em: string;
};
