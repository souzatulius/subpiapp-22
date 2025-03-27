
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UserInfoForm from './UserInfoForm';
import { useUserInfoDialog } from './useUserInfoDialog';
import { User } from './types';
import { toast } from '@/components/ui/use-toast';

interface UserInfoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userId: string, data: { whatsapp?: string; aniversario?: string }) => Promise<void>;
  saving: boolean;
}

const UserInfoEditDialog: React.FC<UserInfoEditDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
  saving,
}) => {
  const { handleSubmit, handleCancel } = useUserInfoDialog({
    open,
    onOpenChange,
    user,
    onSave,
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Informações do Usuário</DialogTitle>
        </DialogHeader>
        
        <UserInfoForm
          user={user}
          onSubmit={handleSubmit}
          saving={saving}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoEditDialog;
