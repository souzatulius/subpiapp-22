
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from './types';
import { Loader2 } from 'lucide-react';

interface UserApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onApprove: (userId: string, userName: string, userEmail: string) => void;
  approving: boolean;
}

const UserApprovalDialog: React.FC<UserApprovalDialogProps> = ({
  open,
  onOpenChange,
  user,
  onApprove,
  approving
}) => {
  if (!user) return null;
  
  console.log("Approval dialog rendered with user:", user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Approve button clicked, calling onApprove with:", user.id, user.nome_completo, user.email);
    onApprove(user.id, user.nome_completo, user.email);
    // Don't close the dialog immediately to allow the approval process to complete with visual feedback
    // The dialog will be closed by the parent component after the approval process is completed
  };

  return (
    <Dialog open={open} onOpenChange={approving ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar Acesso de Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <div className="p-2 bg-gray-50 rounded-md">{user.nome_completo}</div>
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-gray-50 rounded-md">{user.email}</div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Este usuário receberá permissão de Administrador automaticamente após a aprovação.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={approving}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={approving}
              className="bg-green-600 hover:bg-green-700"
            >
              {approving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aprovando...
                </>
              ) : (
                'Aprovar Acesso'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserApprovalDialog;
