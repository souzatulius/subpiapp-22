
import { z } from 'zod';

export const NotaFormSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  conteudo: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres'),
  problema_id: z.string().optional(),
  tema_id: z.string().optional(),
  status: z.enum(['pendente', 'publicada', 'rejeitada']).default('pendente'),
});

export type NotaFormData = z.infer<typeof NotaFormSchema>;
