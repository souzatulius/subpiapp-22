
import { z } from 'zod';
import { ReactNode } from 'react';

export const formSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").max(50, "Título deve ter no máximo 50 caracteres"),
  path: z.string().min(1, "Caminho é obrigatório"),
  color: z.enum(["blue", "green", "orange", "gray-light", "gray-dark", "blue-dark", "orange-light", "gray-ultra-light"]),
  iconId: z.string(),
  width: z.enum(["25", "50", "75", "100"]).default("25"),
  height: z.enum(["1", "2"]).default("1"),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    icon: ReactNode;
    path: string;
    color: "blue" | "green" | "orange" | "gray-light" | "gray-dark" | "blue-dark" | "orange-light" | "gray-ultra-light";
    width?: "25" | "50" | "75" | "100";
    height?: "1" | "2";
  }) => void;
  initialData?: any;
}

export interface CardFormPreviewProps {
  title: string;
  iconId: string;
  color: string;
  width: string;
  height: string;
}
