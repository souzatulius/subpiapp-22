
import { z } from 'zod';
import { ReactNode } from 'react';

export const formSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").max(50, "Título deve ter no máximo 50 caracteres"),
  type: z.enum(["standard", "data_dynamic", "quickDemand", "search", "overdueDemands", "pendingActions", "welcome_card"]).default("standard"),
  path: z.string().optional(),
  color: z.enum(["blue", "green", "orange", "gray-light", "gray-dark", "blue-dark", "orange-light", "gray-ultra-light", "lime", "orange-600"]),
  iconId: z.string(),
  width: z.enum(["25", "50", "75", "100"]).default("25"),
  height: z.enum(["1", "2"]).default("1"),
  dataSourceKey: z.string().optional(),
  displayMobile: z.boolean().default(true),
  mobileOrder: z.number().default(0),
  allowedDepartments: z.array(z.string()).optional(),
  allowedRoles: z.array(z.string()).optional(),
  customProperties: z.object({
    description: z.string().optional(),
    gradient: z.string().optional(),
    isQuickDemand: z.boolean().optional(),
    isSearch: z.boolean().optional(),
    isOverdueDemands: z.boolean().optional(),
    isPendingActions: z.boolean().optional()
  }).optional()
});

export type FormSchema = z.infer<typeof formSchema>;

export interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    type?: "standard" | "data_dynamic" | "quickDemand" | "search" | "overdueDemands" | "pendingActions" | "welcome_card";
    icon: ReactNode;
    iconId: string;
    path?: string;
    color: "blue" | "green" | "orange" | "gray-light" | "gray-dark" | "blue-dark" | "orange-light" | "gray-ultra-light" | "lime" | "orange-600";
    width?: "25" | "50" | "75" | "100";
    height?: "1" | "2";
    dataSourceKey?: string;
    displayMobile?: boolean;
    mobileOrder?: number;
    allowedDepartments?: string[];
    allowedRoles?: string[];
    customProperties?: {
      description?: string;
      gradient?: string;
      isQuickDemand?: boolean;
      isSearch?: boolean;
      isOverdueDemands?: boolean;
      isPendingActions?: boolean;
    };
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

export interface CardFormFieldsProps {
  isNewCard: boolean;
}
