
import React, { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, BellOff, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    isLoading, 
    error, 
    requestPermissionAndRegisterToken 
  } = useNotifications();
  
  const { user } = useAuth();

  // Handle successful setup
  const handleEnableNotifications = async () => {
    const result = await requestPermissionAndRegisterToken();
    if (result) {
      toast({
        title: 'Notificações ativadas',
        description: 'Você receberá notificações importantes sobre suas demandas.',
      });
    }
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro nas notificações',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  // Don't show anything if user isn't logged in
  if (!user) return null;

  // Show unsupported message
  if (isNotificationsSupported === false) {
    return (
      <div className="flex items-center gap-2 p-3 mb-4 text-sm bg-yellow-50 border border-yellow-200 rounded-md">
        <BellOff className="h-5 w-5 text-yellow-500" />
        <span>Seu navegador não suporta notificações push.</span>
      </div>
    );
  }

  // Still checking support or not initialized
  if (isNotificationsSupported === null) {
    return null;
  }

  // Already granted
  if (notificationsPermission === 'granted') {
    return (
      <div className="flex items-center gap-2 p-3 mb-4 text-sm bg-green-50 border border-green-200 rounded-md">
        <Bell className="h-5 w-5 text-green-500" />
        <span>Notificações estão ativadas.</span>
      </div>
    );
  }

  // Denied permission
  if (notificationsPermission === 'denied') {
    return (
      <div className="flex items-center gap-2 p-3 mb-4 text-sm bg-red-50 border border-red-200 rounded-md">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <span>Notificações estão bloqueadas. Habilite-as nas configurações do seu navegador para receber atualizações.</span>
      </div>
    );
  }

  // Default - request permission
  return (
    <div className="flex flex-col p-4 mb-4 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <span className="text-sm">Ativar notificações para receber atualizações sobre suas demandas?</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleEnableNotifications}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aguarde...
            </>
          ) : (
            'Ativar'
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsEnabler;
