
import { useState, useEffect } from 'react';
import { User } from './types';
import { FormValues } from './UserInfoForm';
import { parseFormattedDate } from '@/lib/inputFormatting';

interface UseUserInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userId: string, data: { whatsapp?: string; aniversario?: string }) => Promise<void>;
}

export const useUserInfoDialog = ({
  open,
  onOpenChange,
  user,
  onSave,
}: UseUserInfoDialogProps) => {
  const handleSubmit = async (data: FormValues) => {
    if (!user) return;
    
    // Convert the formatted date string to ISO format if it exists
    let aniversario: string | undefined = undefined;
    if (data.aniversario) {
      const parsedDate = parseFormattedDate(data.aniversario);
      if (parsedDate) {
        aniversario = parsedDate.toISOString();
      }
    }
    
    await onSave(user.id, {
      whatsapp: data.whatsapp,
      aniversario
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return {
    handleSubmit,
    handleCancel,
  };
};
