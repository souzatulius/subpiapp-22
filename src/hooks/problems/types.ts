
import { z } from 'zod';

export type Problem = {
  id: string;
  descricao: string;
  area_coordenacao_id: string;
  areas_coordenacao?: {
    id: string;
    descricao: string;
    coordenacao?: string;
    coordenacao_id?: string;
  };
  criado_em?: string;
  atualizado_em?: string;
};

export type Area = {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao?: string;
  coordenacao_id?: string;
  criado_em?: string;
};

export const problemSchema = z.object({
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  area_coordenacao_id: z.string().min(1, { message: "Selecione uma área de coordenação" })
});
