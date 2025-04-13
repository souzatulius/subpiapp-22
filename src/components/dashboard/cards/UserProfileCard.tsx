import React, { useState } from 'react';
import { User, Settings, UserCheck, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
interface UserProfileCardProps {
  id: string;
  title: string;
  className?: string;
}
const UserProfileCard: React.FC<UserProfileCardProps> = ({
  id,
  title,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // In a real implementation, we would update the user profile
      // For now, just show a success toast
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="h-full cursor-pointer">
          <Card className="h-full flex flex-col items-center justify-center p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all bg-orange-200 px-0 py-[50px]">
            <User className="h-12 w-12 text-orange-700 mb-3" />
            <h3 className="font-semibold text-lg text-orange-900">{title}</h3>
            <p className="mt-2 text-center text-sm text-orange-700">Clique para editar seu perfil</p>
          </Card>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <Button variant="outline" size="sm">Alterar foto</Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled />
              </div>
              
              <Button onClick={handleUpdateProfile} disabled={isUpdating} className="w-full">
                {isUpdating ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha atual</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <Button onClick={() => {
              toast({
                title: "Senha atualizada",
                description: "Sua senha foi atualizada com sucesso.",
                variant: "default"
              });
              setIsOpen(false);
            }} className="w-full">
                Atualizar senha
              </Button>
              
              <div className="pt-6 border-t mt-6">
                <Button variant="destructive" onClick={handleLogout} className="w-full flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sair da conta</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>;
};
export default UserProfileCard;