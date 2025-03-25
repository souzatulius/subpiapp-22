
import { z } from 'zod';

// Define types for coordination areas
export type CoordinationArea = {
  id: string;
  descricao: string;
  sigla?: string;
  coordenacao?: string;
  coordenacao_id?: string;
  criado_em?: string;
};

// Alias for compatibility with existing code
export type Area = CoordinationArea;

// Schema for validation of forms
export const areaSchema = z.object({
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  sigla: z.string().optional(),
  coordenacao_id: z.string().optional()
});

// Correctly export these types using export type syntax
export type { Coordination } from '@/hooks/settings/useCoordination';
