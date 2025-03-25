
import { z } from 'zod';

// Schema para validação de comunicados
export const announcementSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  mensagem: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
  destinatarios: z.string().min(1, 'Informe os destinatários'),
  area_id: z.string().optional(),
  cargo_id: z.string().optional(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export interface User {
  id: string;
  nome_completo: string;
  email: string;
}

export interface Area {
  id: string;
  descricao: string;
}

export interface Cargo {
  id: string;
  descricao: string;
}

export interface Announcement {
  id: string;
  titulo: string;
  mensagem: string;
  destinatarios: string;
  data_envio: string;
  autor_id: string;
  autor: {
    id: string;
    nome_completo: string;
    email: string;
  };
}
