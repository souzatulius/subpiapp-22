
import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import AttentionBox from '@/components/ui/attention-box';

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    isLoading, 
    error, 
    requestPermissionAndRegisterToken 
  } = useNotifications();
  
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

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

  // Handler to dismiss notification message
  const handleDismiss = () => {
    setDismissed(true);
  };

  // Don't show anything if user isn't logged in or banner was dismissed
  if (!user || dismissed) return null;

  // Show unsupported message
  if (isNotificationsSupported === false) {
    return (
      <div className="mb-4">
        <AttentionBox 
          title="Notificações não suportadas" 
          variant="warning"
          className="flex justify-between items-start"
        >
          <div className="flex-1">Seu navegador não suporta notificações push.</div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="p-1 h-6 w-6 ml-2">
            <X className="h-4 w-4" />
          </Button>
        </AttentionBox>
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
      <div className="mb-4">
        <AttentionBox 
          title="Notificações ativadas" 
          variant="info"
          className="flex justify-between items-start"
        >
          <div className="flex-1">Notificações estão ativadas.</div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="p-1 h-6 w-6 ml-2">
            <X className="h-4 w-4" />
          </Button>
        </AttentionBox>
      </div>
    );
  }

  // Denied permission
  if (notificationsPermission === 'denied') {
    return (
      <div className="mb-4">
        <AttentionBox 
          title="Notificações bloqueadas" 
          variant="warning"
          className="flex justify-between items-start"
        >
          <div className="flex-1">Notificações estão bloqueadas. Habilite-as nas configurações do seu navegador para receber atualizações.</div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="p-1 h-6 w-6 ml-2">
            <X className="h-4 w-4" />
          </Button>
        </AttentionBox>
      </div>
    );
  }

  // Default - request permission
  return (
    <div className="mb-4">
      <AttentionBox 
        title="Ativar notificações" 
        variant="info"
        className="flex flex-col"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm">Ativar notificações para receber atualizações sobre suas demandas?</span>
          <div className="flex items-center gap-2 ml-4">
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
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="p-1 h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AttentionBox>
    </div>
  );
};

export default NotificationsEnabler;
