
import { z } from 'zod';
import { ReactNode } from 'react';
import { CardColor } from '@/types/dashboard';

export const formSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").max(50, "Título deve ter no máximo 50 caracteres"),
  subtitle: z.string().optional(),
  type: z.enum(["standard", "data_dynamic"]).default("standard"),
  path: z.string().optional(),
  color: z.custom<CardColor>(),
  iconId: z.string(),
  width: z.enum(["25", "50", "75", "100"]).default("25"),
  height: z.enum(["1", "2"]).default("1"),
  dataSourceKey: z.string().optional(),
  displayMobile: z.boolean().default(true),
  mobileOrder: z.number().default(0),
  allowedDepartments: z.array(z.string()).optional(),
  allowedRoles: z.array(z.string()).optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    type?: "standard" | "data_dynamic";
    icon: ReactNode;
    path?: string;
    color: CardColor;
    width?: "25" | "50" | "75" | "100";
    height?: "1" | "2";
    dataSourceKey?: string;
    displayMobile?: boolean;
    mobileOrder?: number;
    allowedDepartments?: string[];
    allowedRoles?: string[];
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
