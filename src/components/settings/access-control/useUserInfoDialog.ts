
import React from 'react';
import { format } from 'date-fns';
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
    
    await onSave(user.id, {
      whatsapp: data.whatsapp,
      aniversario: data.aniversario ? format(data.aniversario, 'yyyy-MM-dd') : undefined,
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
