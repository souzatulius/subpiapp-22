import React, { useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
interface NotificationSettingsCardProps {
  id: string;
  title: string;
  className?: string;
}
const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  id,
  title,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [summaryFrequency, setSummaryFrequency] = useState('daily');
  const [isUpdating, setIsUpdating] = useState(false);
  const handleSaveSettings = async () => {
    setIsUpdating(true);
    try {
      // In a real implementation, we would save to the database
      // For now, just show a toast
      setTimeout(() => {
        toast({
          title: "Configurações salvas",
          description: "Suas preferências de notificação foram atualizadas.",
          variant: "default"
        });
        setIsOpen(false);
        setIsUpdating(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas configurações.",
        variant: "destructive"
      });
      setIsUpdating(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="h-full cursor-pointer">
          <Card className="my-0 py-[81px]">
            <Bell className="h-12 w-12 text-gray-600 mb-3" />
            <h3 className="font-semibold text-lg text-center py-0">{title}</h3>
            <p className="text-gray-500 mt-2 text-center text-xs">Configure suas notificações</p>
          </Card>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>Configurações de Notificação</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium mb-1">Notificações no navegador</h4>
              <p className="text-xs text-gray-500">Receba notificações em tempo real</p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium mb-1">Notificações por email</h4>
              <p className="text-xs text-gray-500">Receba notificações no seu email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-1">Frequência do resumo de atividades</h4>
            <RadioGroup value={summaryFrequency} onValueChange={setSummaryFrequency} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Diário</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Semanal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Nunca</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3 pt-3 border-t">
            <h4 className="text-sm font-medium mb-1">Tipos de notificação</h4>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="new-demand">Novas demandas</Label>
              <Switch id="new-demand" defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="response-demand">Respostas às demandas</Label>
              <Switch id="response-demand" defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="note-approval">Aprovação de notas</Label>
              <Switch id="note-approval" defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="communications">Comunicados importantes</Label>
              <Switch id="communications" defaultChecked />
            </div>
          </div>
          
          <Button onClick={handleSaveSettings} disabled={isUpdating} className="w-full">
            {isUpdating ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default NotificationSettingsCard;