
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface UserInfoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: User) => Promise<void>;
  saving: boolean;
}

const UserInfoEditDialog: React.FC<UserInfoEditDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
  saving
}) => {
  if (!user) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave(user);
    }
  };
  
  // Determine entity type
  const entityType = user.supervisao_tecnica_id 
    ? 'Supervisão Técnica' 
    : 'Coordenação';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Entidade</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="entityType">Tipo</Label>
            <Input 
              id="entityType" 
              value={entityType} 
              disabled 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              value={user.nome_completo} 
              disabled 
            />
          </div>
          
          {user.coordenacao_id && user.supervisao_tecnica_id && (
            <div className="space-y-2">
              <Label htmlFor="parent">Coordenação</Label>
              <Input 
                id="parent" 
                value={user.coordenacao_id || ''} 
                disabled 
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoEditDialog;
