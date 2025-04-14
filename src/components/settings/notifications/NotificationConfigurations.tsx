
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/notifications';
import { toast } from '@/components/ui/use-toast';

const NotificationConfigurations: React.FC = () => {
  const [isEnabling, setIsEnabling] = useState(false);
  const { 
    isNotificationsSupported,
    isPermissionGranted,
    requestPermissionAndRegisterToken
  } = useNotifications();

  const handleEnableNotifications = async () => {
    setIsEnabling(true);
    try {
      const result = await requestPermissionAndRegisterToken();
      if (result) {
        toast({
          title: 'Notificações ativadas',
          description: 'Você receberá notificações em tempo real neste dispositivo.',
          variant: 'success'
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível ativar as notificações. Verifique as permissões do navegador.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar ativar as notificações.',
        variant: 'destructive'
      });
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações do Navegador</CardTitle>
          <CardDescription>
            Receba alertas em tempo real, mesmo quando não estiver com o aplicativo aberto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isNotificationsSupported ? (
            isPermissionGranted ? (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Notificações estão ativadas</p>
                  <p className="text-sm">Você receberá alertas em tempo real neste dispositivo.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-md text-orange-800">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Notificações não estão ativadas</p>
                    <p className="text-sm">Ative as notificações para receber alertas em tempo real.</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleEnableNotifications}
                    disabled={isEnabling}
                    className="flex items-center gap-2"
                  >
                    {isEnabling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                    Ativar notificações do navegador
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Navegador não suportado</p>
                <p className="text-sm">Este navegador não suporta notificações push. Tente usar Chrome, Firefox, Safari ou Edge.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos de Notificação</CardTitle>
          <CardDescription>
            Configure quais eventos geram notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <div className="p-1.5 bg-blue-100 rounded-md mr-2">
                <Bell className="h-4 w-4 text-blue-700" />
              </div>
              <span>Novas demandas</span>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </Label>
          
          <Label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <div className="p-1.5 bg-green-100 rounded-md mr-2">
                <Check className="h-4 w-4 text-green-700" />
              </div>
              <span>Respostas técnicas</span>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </Label>
          
          <Label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <div className="p-1.5 bg-orange-100 rounded-md mr-2">
                <Bell className="h-4 w-4 text-orange-700" />
              </div>
              <span>Aprovação de notas</span>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </Label>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationConfigurations;
