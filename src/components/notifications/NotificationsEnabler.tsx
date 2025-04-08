
import React from 'react';
import { Button } from '@/components/ui/button';
import { BellRing } from 'lucide-react';
import { useNotifications } from '@/hooks/notifications';

const NotificationsEnabler: React.FC = () => {
  const { 
    isNotificationsSupported,
    isPermissionGranted,
    requestPermissionAndRegisterToken
  } = useNotifications();

  const handleEnableNotifications = async () => {
    await requestPermissionAndRegisterToken();
  };

  if (!isNotificationsSupported) {
    return null;
  }

  if (isPermissionGranted) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BellRing className="text-blue-500 h-5 w-5" />
          <p className="text-sm text-blue-700">
            Ative as notificações para receber atualizações importantes
          </p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
          onClick={handleEnableNotifications}
        >
          Ativar
        </Button>
      </div>
    </div>
  );
};

export default NotificationsEnabler;
