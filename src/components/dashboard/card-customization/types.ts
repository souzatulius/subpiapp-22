
import { z } from 'zod';
import React from 'react';

// Define the form schema
export const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(50, "O título deve ter no máximo 50 caracteres"),
  path: z.string().min(1, "O caminho é obrigatório"),
  color: z.enum(['blue', 'green', 'orange', 'purple', 'red', 'gray-light', 'gray-dark', 'blue-dark', 'orange-light']),
  iconId: z.string().min(1, "Selecione um ícone"),
  width: z.enum(['25', '50', '75', '100']),
  height: z.enum(['1', '2']),
});

export type FormSchema = z.infer<typeof formSchema>;

// Component properties
export interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { 
    title: string; 
    icon: React.ReactNode; 
    path: string; 
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
    width?: '25' | '50' | '75' | '100';
    height?: '1' | '2';
  }) => void;
  initialData?: {
    id: string;
    title: string;
    icon: React.ReactNode;
    path: string;
    color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
    width?: '25' | '50' | '75' | '100';
    height?: '1' | '2';
  };
}

export interface ColorOptionsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export interface IconSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export interface CardFormPreviewProps {
  title: string;
  iconId: string;
  color: string;
  width: string;
  height: string;
}
