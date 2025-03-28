import { useState } from 'react';
import { User } from './types';
import { FormValues } from './UserInfoForm';

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
    
    // Keep the aniversario as formatted string and let the handler
    // convert it to date format when saving to database
    await onSave(user.id, {
      whatsapp: data.whatsapp,
      aniversario: data.birthday
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
