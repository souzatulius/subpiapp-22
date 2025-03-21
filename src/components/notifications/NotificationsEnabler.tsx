
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported, 
    notificationsPermission, 
    requestPermissionAndRegisterToken, 
    isLoading
  } = useNotifications();

  // Don't render if notifications are not supported or already granted
  if (!isNotificationsSupported || notificationsPermission === 'granted') {
    return null;
  }

  return (
    <div className="col-span-1 md:col-span-4">
      <Card className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-xl shadow-md overflow-hidden h-full">
        <CardContent className="p-4 relative flex items-center space-x-3 transform-gpu hover:scale-[1.03] transition-all duration-300 overflow-hidden">
          <BellOff className="h-6 w-6 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-sm">Notificações desativadas</h3>
            <p className="text-xs">Ative para receber alertas importantes</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-300 hover:bg-yellow-100 text-yellow-800 text-xs whitespace-nowrap"
            onClick={requestPermissionAndRegisterToken}
            disabled={isLoading}
          >
            {isLoading ? 'Ativando...' : 'Ativar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsEnabler;
