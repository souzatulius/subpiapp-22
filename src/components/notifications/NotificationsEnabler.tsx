
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BellOff, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/components/ui/use-toast';

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    requestPermissionAndRegisterToken, 
    isLoading
  } = useNotifications();
  
  const [isVisible, setIsVisible] = useState(true);
  const [showError, setShowError] = useState(false);
  
  // Load visibility state from session storage on mount
  useEffect(() => {
    const storedVisibility = sessionStorage.getItem('notificationsEnablerVisible');
    if (storedVisibility === 'false') {
      setIsVisible(false);
    }
  }, []);
  
  // Don't render if notifications are not supported, already granted, or user dismissed
  if (!isNotificationsSupported || notificationsPermission === 'granted' || !isVisible) {
    return null;
  }

  const handleActivation = async () => {
    try {
      const success = await requestPermissionAndRegisterToken();
      
      if (!success) {
        setShowError(true);
        
        if (notificationsPermission === 'denied') {
          toast({
            title: "Notificações bloqueadas",
            description: "Você bloqueou as notificações. Por favor, altere as permissões no seu navegador para receber notificações.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Notificações ativadas",
          description: "Você receberá notificações importantes sobre suas demandas.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
      setShowError(true);
    }
  };
  
  const handleClose = () => {
    setIsVisible(false);
    // Save to session storage so it stays hidden for this session only
    sessionStorage.setItem('notificationsEnablerVisible', 'false');
  };

  return (
    <div className="col-span-4">
      <Card className="bg-orange-100 text-orange-800 border border-orange-200 rounded-xl shadow-md overflow-hidden h-12">
        <CardContent className="p-3 flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-3">
            <BellOff className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Notificações estão desativadas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 bg-orange-50 hover:bg-orange-200 text-orange-800 text-xs whitespace-nowrap h-8"
              onClick={handleActivation}
              disabled={isLoading || notificationsPermission === 'denied'}
            >
              {isLoading ? 'Ativando...' : 'Ativar'}
            </Button>
            {showError && notificationsPermission === 'denied' && (
              <div className="flex items-center text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Bloqueado pelo navegador</span>
              </div>
            )}
            <button 
              onClick={handleClose}
              className="text-orange-800 hover:text-orange-900 p-1"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsEnabler;
