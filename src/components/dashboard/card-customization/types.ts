
import { z } from 'zod';
import { ReactNode } from 'react';
import { CardColor, CardType } from '@/types/dashboard';

export const formSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").max(50, "Título deve ter no máximo 50 caracteres"),
  subtitle: z.string().optional(),
  type: z.enum(["standard", "data_dynamic", "in_progress_demands", "recent_notes", "origin_selection", "smart_search", "origin_demand_chart", "communications", "pending_activities"]).default("standard"),
  path: z.string().optional(),
  color: z.custom<CardColor>(),
  iconId: z.string(),
  width: z.enum(["25", "50", "75", "100"]).default("25"),
  height: z.enum(["0.5", "1", "2", "3", "4"]).default("1"),
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
    type?: CardType;
    icon: ReactNode;
    path?: string;
    color: CardColor;
    width?: "25" | "50" | "75" | "100";
    height?: "0.5" | "1" | "2" | "3" | "4";
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
  subtitle?: string;
  iconId: string;
  color: string;
}
