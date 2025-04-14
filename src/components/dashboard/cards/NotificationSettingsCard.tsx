
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AccountSettingsModal from '@/components/profile/AccountSettingsModal';

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
  
  return (
    <>
      <div 
        className="h-full cursor-pointer" 
        onClick={() => setIsOpen(true)}
      >
        <Card className="h-full flex flex-col items-center justify-center p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all bg-orange-200 py-[20px] px-[10px]">
          <Bell className="h-12 w-12 text-gray-600 mb-3" />
          <h3 className="font-semibold text-lg text-center py-0">{title}</h3>
          <p className="text-gray-500 mt-2 text-center text-xs">Configure suas notificações</p>
        </Card>
      </div>
      
      <AccountSettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTab="app"
      />
    </>
  );
};

export default NotificationSettingsCard;
