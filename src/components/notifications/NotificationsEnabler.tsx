
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    requestPermissionAndRegisterToken, 
    isLoading
  } = useNotifications();
  
  const [isVisible, setIsVisible] = useState(true);
  
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
              onClick={requestPermissionAndRegisterToken}
              disabled={isLoading}
            >
              {isLoading ? 'Ativando...' : 'Ativar'}
            </Button>
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
